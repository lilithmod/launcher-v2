//go:build !windows
// +build !windows

package update

import (
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/blang/semver"
	"github.com/rhysd/go-github-selfupdate/selfupdate"
)

const Version = "0.4.0"

func DoSelfUpdate() bool {
	v := semver.MustParse(Version)
	latest, err := selfupdate.UpdateSelf(v, "lilithmod/launcher-v2")
	if err != nil {
		log.Println("Binary update failed:", err)
		return false
	}
	if latest.Version.Equals(v) {
		log.Println("Current binary is the latest version", Version)
		return true
	} else {
		log.Println("Successfully updated to version", latest.Version)
		log.Println("Release note:\n", latest.ReleaseNotes)
		return true
	}
}

func DoSelfUpdateMac() bool {
	latest, found, _ := selfupdate.DetectLatest("lilithmod/launcher-v2")
	if found {
		homeDir, _ := os.UserHomeDir()
		downloadPath := filepath.Join(homeDir, "Downloads", "LilithLauncher.zip")
		curl := exec.Command("curl", "-L", latest.AssetURL, "-o", downloadPath)
		err := curl.Run()
		if err != nil {
			log.Println("curl error:", err)
			return false
		}
		var appPath string
		cmdPath, err := os.Executable()
		appPath = strings.TrimSuffix(cmdPath, "Lilith Launcher.app/Contents/MacOS/Lilith Launcher")
		if err != nil {
			appPath = "/Applications/"
		}
		ditto := exec.Command("ditto", "-xk", downloadPath, appPath)
		err = ditto.Run()
		if err != nil {
			log.Println("ditto error:", err)
			return false
		}
		rmDir := exec.Command("rm", downloadPath)
		err = rmDir.Run()
		if err != nil {
			log.Println("removing error:", err)
			return false
		}
		return true
	} else {
		return false
	}
}

func CheckForUpdate() (bool, string) {
	latest, found, err := selfupdate.DetectLatest("lilithmod/launcher-v2")
	if err != nil {
		log.Println("Error occurred while detecting version:", err)
		return false, ""
	}

	v := semver.MustParse(Version)
	if !found || latest.Version.LTE(v) {
		log.Println("Current version is the latest:", v, found)
		return false, ""
	}

	return true, latest.Version.String()
}
