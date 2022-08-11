package main

import (
	"os"
	"io"
	"fmt"
	"log"
	"path"
	"time"
	"bufio"
	"errors"
	"context"
	"os/exec"
	"strconv"
	"strings"
	"syscall"
	"net/http"
	"io/ioutil"
	"encoding/json"
	
	runtime_os "runtime"
	//"github.com/hugolgst/rich-go/client"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var cmd *exec.Cmd

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
}

type launcherConfig struct {
	Alpha bool `json:"alpha"`
	Debug bool `json:"debug"`
}

func handle(err error, ctx context.Context) {
	if err != nil {
		runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
			    Type:         "error",
				 Title:        "Lilith has encountered an error.",
				 Message:      err.Error(),
				 Buttons:      []string{"Ok"},
				 CancelButton:  "Ok",
		})
		log.Fatalln(err)
	}
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
			runtime.EventsEmit(ctx, "launch_lilith", fmt.Sprintf("\r%.0f", percent) + "% Downloaded")
			runtime.EventsEmit(ctx, "lilith_log", fmt.Sprintf("\r[Launcher] %.0f", percent) + "% Downloaded")
			fmt.Printf("\r%.0f", percent)
			print("% Downloaded")
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

func (a *App) domReady(ctx context.Context) {
	a.ctx = ctx
	
	// err := client.Login("1007151511370993694")
	// if err != nil {
	// 	handle(err, ctx)
	// }
	// 
	// now := time.Now()
	// err = client.SetActivity(client.Activity{
	// 	Details:    "Lilith v1 on mc.hypixel.net",
	// 	LargeImage: "lilithlogo",
	// 	SmallImage: "hypixellogo",
	// 	SmallText:  "mc.hypixel.net",
	// 	Timestamps: &client.Timestamps{
	// 		Start: &now,
	// 	},
	// 	Buttons: []*client.Button{
	// 		&client.Button{
	// 			Label: "Join the discord",
	// 			Url:   "discord.gg/lilith",
	// 		},
	// 		&client.Button{
	// 			Label: "Learn more",
	// 			Url:   "https://lilithmod.xyz",
	// 		},
	// 	},
	// })
	// if err != nil {
	// 	handle(err, ctx)
	// }
	
	runtime.EventsOn(ctx, "stop", func(...interface{}) {
		cmd.Process.Kill()
		runtime.EventsEmit(ctx, "launch_lilith", "ready to launch")
	})
	
	runtime.EventsOn(ctx, "lilith_err", func(...interface{}) {})
	runtime.EventsOn(ctx, "launch_lilith", func(...interface{}) {})
	runtime.EventsOn(ctx, "lilith_log", func(...interface{}) {})
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
	homeDir, err  := os.UserHomeDir()
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
	handle(err, a.ctx)
	ldir := homedir + "/lilith"
	bindir := homedir + "/lilith/bin"
	ldirConfig := ldir + "/config.json"
	
	if _, err := os.Stat(ldir); errors.Is(err, os.ErrNotExist) {
		err := os.Mkdir(ldir, os.ModePerm)
		err = os.Mkdir(bindir, os.ModePerm)
		runtime.EventsEmit(a.ctx, "launch_lilith", "Creating directories")
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Creating directories")
		handle(err, a.ctx)
	} else {
		_, err := os.Stat(ldirConfig)
		if err == nil {
			runtime.EventsEmit(a.ctx, "launch_lilith", "Reading config")
			runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Reading config")
			data, err := os.ReadFile(ldirConfig)
			handle(err, a.ctx)
			err = json.Unmarshal(data, &config)
			handle(err, a.ctx)
		}
	}
	
	var url string
	if config.Alpha {
		url = "https://api.lilithmod.xyz/versions/alpha"
	} else {
		url = "https://api.lilithmod.xyz/versions/latest"
	}
	
	resp, err := http.Get(url)
	handle(err, a.ctx)
	body, err := ioutil.ReadAll(resp.Body)
	handle(err, a.ctx)
	
	var f versionResponse
	err = json.Unmarshal(body, &f)
	handle(err, a.ctx)
	
	runtime.EventsEmit(a.ctx, "launch_lilith", "Launching lilith " + f.Version)
	runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Launching lilith " + f.Version)
	
	var download string
	switch runtime_os.GOOS {
	case "windows":
		download = f.Download.Windows
	case "darwin":
		download = f.Download.Macos
	case "linux":
		download = f.Download.Linux
	default:
		download = f.Download.Linux
	}
	
	filename := download[strings.LastIndex(download, "/")+1:]
	runtime.EventsEmit(a.ctx, "launch_lilith", "Lilith is now running")
	runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Lilith has started")
	
	dir, err := os.ReadDir(bindir)
	handle(err, a.ctx)
	
	path := ""
	for _, v := range dir {
		if v.Name() == filename {
			path = bindir + "/" + v.Name()
		}
	}
	
	if path == "" {
		println("Couldn't find the latest Lilith version, downloading...")
		runtime.EventsEmit(a.ctx, "launch_lilith", "Downloading lilith " + f.Version)
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Downloading lilith " + f.Version)
		err := DownloadFile(bindir + "/" + filename, download, a.ctx)
		handle(err, a.ctx)
		runtime.EventsEmit(a.ctx, "launch_lilith", "Launching lilith " + f.Version)
		runtime.EventsEmit(a.ctx, "launch_lilith", "Lilith is now running")
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Lilith has started")
		println("\r100% Downloaded")
		path = bindir + "/" + filename
	}
	
	if runtime_os.GOOS != "windows" {
		setPerm := exec.Command("chmod", "+x", path)
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Setting file permissions")
		err := setPerm.Run()
		handle(err, a.ctx)
	}
	
	if config.Debug {
		runtime.EventsEmit(a.ctx, "launch_lilith", "Running Lilith in debug mode")
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Running Lilith in debug mode")
		println("Launching Lilith in debug mode")
		cmd = exec.Command(path, "--dev", "--iknowwhatimdoing", "--color=always")
	} else {
		runtime.EventsEmit(a.ctx, "lilith_log", "[Launcher] Starting Lilith")
		cmd = exec.Command(path, "--iknowwhatimdoing", "--color=always")
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
			println("Failed to launch Lilith, deleting...")
			err := os.Remove(path)
			handle(err, a.ctx)
			path, err := os.Executable()
			handle(err, a.ctx)
			err = syscall.Exec(path, []string{os.Args[0], "--headless"}, os.Environ())
			handle(err, a.ctx)
		}
		
	}
	return "launch_complete_emit", err
}