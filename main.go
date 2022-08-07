package main

import (
	"os"
	"fmt"
	"embed"
	"net/http"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

type FileLoader struct {
	 http.Handler
}

func ConfigLoader() *FileLoader {
	 return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	 var err error
	 homeDir, _ := os.UserHomeDir()
	 println("loading file:", homeDir, req.URL.Path)
	 fileData, err := os.ReadFile(fmt.Sprint(homeDir, req.URL.Path))
	 if err != nil {
		  res.WriteHeader(http.StatusBadRequest)
		  res.Write([]byte(fmt.Sprintf("Could not load file %s", req.URL.Path)))
	 }

	 res.Write(fileData)
}

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "Lilith Launcher",
		Width:            1160,
		DisableResize:      true,
		Height:           644,
		Frameless:          true,
		Assets:           assets,
		AssetsHandler:    ConfigLoader(),
		BackgroundColour: &options.RGBA{R: 23, G: 23, B: 23, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Mac: &mac.Options{
			About: &mac.AboutInfo{
				Title:   "Lilith Launcher",
				Message: "© 2022 Lilith Development",
				Icon:    icon,
			},
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
