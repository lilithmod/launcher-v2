//go:build windows

package main

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path"
	"strconv"
	"strings"
	"syscall"
	"time"

	goruntime "runtime"
	//"github.com/hugolgst/rich-go/client"
	"github.com/wailsapp/wails/v2/pkg/runtime"

	"lilith/internal/update"
)

type App struct {
	ctx context.Context
}

type versionResponse struct {
	Version   string `json:"version"`
	Name      string `json:"name"`
	Changelog struct {
		Features []string `json:"features"`
		Fixes    []string `json:"fixes"`
	}
	Download struct {
		Windows string `json:"windows"`
		Linux   string `json:"linux"`
		Macos   string `json:"macos"`
	}
	Sizes struct {
		Windows int64 `json:"windows"`
		Linux   int64 `json:"linux"`
		Macos   int64 `json:"macos"`
	}
}

type launcherConfig struct {
	Alpha bool `json:"alpha"`
	Debug bool `json:"debug"`
}

var cmd *exec.Cmd

func (a *App) domReady(ctx context.Context) {
	a.ctx = ctx

	runtime.LogInfo(ctx, "Checking For Updates")
	a.UpdateCheckUI()

	runtime.EventsOn(ctx, "stop", func(...interface{}) {
		cmd.Process.Kill()
		runtime.EventsEmit(ctx, "launch_lilith", "ready to launch")
	})

	runtime.EventsOn(ctx, "lilith_err", func(...interface{}) {})
	runtime.EventsOn(ctx, "launch_lilith", func(...interface{}) {})
	runtime.EventsOn(ctx, "lilith_log", func(...interface{}) {})
}

func (a *App) shutdown(ctx context.Context) {
	cmd.Process.Kill()
	os.Exit(1)
}

func hasArg(str string) bool {
	return isElementExist(os.Args, str)
}

func isElementExist(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}
	return false
}

func DownloadFile(dest string, url string, ctx context.Context) error {
	out, err := os.Create(dest)
	defer out.Close()
	headResp, err := http.Head(url)

	if err != nil {
		panic(err)
	}

	defer headResp.Body.Close()

	size, err := strconv.Atoi(headResp.Header.Get("Content-Length"))

	if err != nil {
		panic(err)
	}

	done := make(chan int64)
	go PrintDownloadPercent(done, dest, int64(size), ctx)

	resp, err := http.Get(url)

	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	n, err := io.Copy(out, resp.Body)
	done <- n

	return err
}

func PrintDownloadPercent(done chan int64, path string, total int64, ctx context.Context) {
	var stop bool = false
	file, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	for {
		select {
		case <-done:
			stop = true
		default:
			fi, err := file.Stat()
			if err != nil {
				log.Fatal(err)
			}

			size := fi.Size()
			if size == 0 {
				size = 1
			}

			var percent float64 = float64(size) / float64(total) * 100
			runtime.EventsEmit(ctx, "launch_lilith", fmt.Sprintf("%.0f%% Downloaded", percent))
			runtime.EventsEmit(ctx, "lilith_log", fmt.Sprintf("[Launcher] %.0f%% Downloaded", percent))
			runtime.LogInfo(ctx, fmt.Sprintf("\r%.0f", percent))
		}

		if stop {
			break
		}
		time.Sleep(time.Second)
	}
}

func NewApp() *App {
	return &App{}
}

func (a *App) HandleError(err error) {
	if err != nil {
		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:         "error",
			Title:        "Lilith has encountered an error.",
			Message:      err.Error(),
			Buttons:      []string{"Ok"},
			CancelButton: "Ok",
		})
		runtime.LogError(a.ctx, err.Error())
	}
}

func (a *App) HandleErrorFrontend(err string) {
	runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:         "error",
		Title:        "Lilith has encountered an error.",
		Message:      err,
		Buttons:      []string{"Ok"},
		CancelButton: "Ok",
	})
}

func (a *App) GetVersion() string {
	return update.Version
}

func (a *App) HTTPGetRequest(url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), err
}

func (a *App) ShowDialog(dialogTitle string, dialogMessage string, dialogButtons []string, dialogDefaultButton string, dialogCancelButton string, meta string) string {
	runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Title:         dialogTitle,
		Message:       dialogMessage,
		Buttons:       dialogButtons,
		DefaultButton: dialogDefaultButton,
		CancelButton:  dialogCancelButton,
	})
	log.Println("[Dialog] Title:", dialogTitle, "Message:", dialogMessage)

	return meta
}

func (a *App) LoadConfig() (string, error) {
	homeDir, _ := os.UserHomeDir()
	fileData, err := os.ReadFile(fmt.Sprint(homeDir, "/lilith/store.json"))
	if err != nil {
		return "", err
	}
	return string(fileData), err
}

func (a *App) SaveConfig(config string) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	filename := path.Join(homeDir, "/lilith/store.json")
	return ioutil.WriteFile(filename, []byte(config), 0600)
}

func (a *App) LaunchLilith() (string, error) {
	config := launcherConfig{
		Alpha: false,
		Debug: false,
	}

	// update button status early
	runtime.EventsEmit(a.ctx, "launch_lilith", "Fetching lilith versions")
	runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Fetching lilith versions")

	homedir, err := os.UserHomeDir()
	a.HandleError(err)
	ldir := homedir + "/lilith"
	bindir := homedir + "/lilith/bin"
	ldirConfig := ldir + "/store.json"

	if _, err := os.Stat(bindir); errors.Is(err, os.ErrNotExist) {
		err := os.Mkdir(ldir, os.ModePerm)
		err = os.Mkdir(bindir, os.ModePerm)
		runtime.EventsEmit(a.ctx, "launch_lilith", "Creating directories")
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Creating directories")
		a.HandleError(err)
	} else {
		msg, err := os.Stat(ldirConfig)
		log.Println(msg)
		if err == nil {
			runtime.EventsEmit(a.ctx, "launch_lilith", "Reading config")
			runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Reading config")
			data, err := os.ReadFile(ldirConfig)
			a.HandleError(err)
			err = json.Unmarshal(data, &config)
			a.HandleError(err)
		}
	}

	var url string
	if config.Alpha {
		url = "https://api.lilith.rip/versions/alpha"
	} else {
		url = "https://api.lilith.rip/versions/latest"
	}

	resp, err := http.Get(url)
	a.HandleError(err)
	body, err := ioutil.ReadAll(resp.Body)
	a.HandleError(err)

	var f versionResponse
	err = json.Unmarshal(body, &f)
	a.HandleError(err)

	runtime.EventsEmit(a.ctx, "launch_lilith", "Launching lilith "+f.Version)
	runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Launching lilith "+f.Version)

	var download string
	switch goruntime.GOOS {
	case "windows":
		download = f.Download.Windows
	case "darwin":
		download = f.Download.Macos
	case "linux":
		download = f.Download.Linux
	default:
		download = f.Download.Linux
	}

	var size int64
	switch goruntime.GOOS {
	case "windows":
		size = f.Sizes.Windows
	case "darwin":
		size = f.Sizes.Macos
	case "linux":
		size = f.Sizes.Linux
	default:
		size = f.Sizes.Linux
	}

	filename := download[strings.LastIndex(download, "/")+1:]
	runtime.EventsEmit(a.ctx, "launch_lilith", "Lilith is now running")

	dir, err := os.ReadDir(bindir)
	a.HandleError(err)

	path := ""
	for _, v := range dir {
		if v.Name() == filename {
			path = bindir + "/" + v.Name()
		}
	}

	if path == "" {
		runtime.LogInfo(a.ctx, "Couldn't find the latest Lilith version, downloading...")
		runtime.EventsEmit(a.ctx, "launch_lilith", "Downloading lilith "+f.Version)
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Downloading lilith "+f.Version)
		err := DownloadFile(bindir+"/"+filename, download, a.ctx)
		a.HandleError(err)
		runtime.EventsEmit(a.ctx, "launch_lilith", "Launching lilith "+f.Version)
		runtime.EventsEmit(a.ctx, "launch_lilith", "Lilith is now running")
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Lilith has started")
		runtime.LogInfo(a.ctx, "\rDownload Complete")
		path = bindir + "/" + filename
	} else {
		fi, _ := os.Stat(path)
		if fi.Size() != size {
			err := os.Remove(path)
			a.HandleError(err)
			runtime.LogInfo(a.ctx, "Couldn't find the latest Lilith version, downloading...")
			runtime.EventsEmit(a.ctx, "launch_lilith", "Downloading lilith "+f.Version)
			runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Downloading lilith "+f.Version)
			err = DownloadFile(bindir+"/"+filename, download, a.ctx)
			a.HandleError(err)
			runtime.EventsEmit(a.ctx, "launch_lilith", "Launching lilith "+f.Version)
			runtime.EventsEmit(a.ctx, "launch_lilith", "Lilith is now running")
			runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Lilith has started")
			runtime.LogInfo(a.ctx, "\rDownload Complete")
			path = bindir + "/" + filename
		}
	}

	if goruntime.GOOS != "windows" {
		setPerm := exec.Command("chmod", "+x", path)
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Setting file permissions")
		err := setPerm.Run()
		a.HandleError(err)
	}

	if config.Debug {
		runtime.EventsEmit(a.ctx, "launch_lilith", "Running Lilith in debug mode")
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Running Lilith in debug mode")
		runtime.LogInfo(a.ctx, "Launching Lilith in debug mode")
		cmd = exec.Command(path, "--dev", "--iknowwhatimdoing", "--ireallyknowwhatimdoing", "--color=always")
	} else {
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Lilith has started")
		if config.Alpha {
			runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Lilith Beta has started")
		}
		cmd = exec.Command(path, "--iknowwhatimdoing", "--ireallyknowwhatimdoing", "--color=always")
	}

	if goruntime.GOOS == "windows" {
		cmd.SysProcAttr = &syscall.SysProcAttr{CreationFlags: 0x08000000} // CREATE_NO_WINDOW
	}

	var logArr []string
	stdout, _ := cmd.StdoutPipe()
	cmd.Dir = ldir
	err = cmd.Start()
	scanner := bufio.NewScanner(stdout)

	for scanner.Scan() {
		log.Println(scanner.Text())
		logArr = append(logArr, scanner.Text())
		runtime.EventsEmit(a.ctx, "lilith_log", logArr[len(logArr)-1])
	}

	cmd.Wait()

	if err != nil {
		if strings.Contains(err.Error(), "valid Win32 application") || strings.Contains(err.Error(), "segmentation") {
			runtime.EventsEmit(a.ctx, "launch_lilith", "Failed to launch Lilith")
			runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Failed to launch Lilith")
			runtime.LogError(a.ctx, "Failed to launch Lilith, deleting...")
			err := os.Remove(path)
			a.HandleError(err)
			path, err := os.Executable()
			a.HandleError(err)
			err = syscall.Exec(path, []string{os.Args[0], "--headless"}, os.Environ())
			a.HandleError(err)
		}

	}
	runtime.EventsEmit(a.ctx, "launch_lilith", "ready to launch")
	return "launch_complete_emit", err
}

func (a *App) UpdateCheckUI() {
	shouldUpdate, latestVersion := update.CheckForUpdate()
	if shouldUpdate {
		updateMessage := fmt.Sprintf("New Version Available, would you like to update to v%s", latestVersion)
		buttons := []string{"Yes", "No"}
		dialogOpts := runtime.MessageDialogOptions{Title: "Update Available", Message: updateMessage, Type: runtime.QuestionDialog, Buttons: buttons, DefaultButton: "Yes", CancelButton: "No"}
		action, err := runtime.MessageDialog(a.ctx, dialogOpts)
		if err != nil {
			runtime.LogError(a.ctx, "Error in update dialog. ")
		}
		runtime.LogInfo(a.ctx, action)
		if action == "Yes" {
			runtime.LogInfo(a.ctx, "Update clicked")
			var updated bool
			if goruntime.GOOS == "darwin" {
				updated = update.DoSelfUpdateMac()
			} else {
				updated = update.DoSelfUpdate()
			}
			if updated {
				buttons = []string{"Ok"}
				dialogOpts = runtime.MessageDialogOptions{Title: "Update Succeeded", Message: "Update Successfull. Please restart this app to take effect. ", Type: runtime.InfoDialog, Buttons: buttons, DefaultButton: "Ok"}
				runtime.MessageDialog(a.ctx, dialogOpts)
			} else {
				buttons = []string{"Ok"}
				dialogOpts = runtime.MessageDialogOptions{Title: "Update Error", Message: "Update failed, please manually update from GitHub Releases. ", Type: runtime.InfoDialog, Buttons: buttons, DefaultButton: "Ok"}
				runtime.MessageDialog(a.ctx, dialogOpts)
			}
		}
	}
}
