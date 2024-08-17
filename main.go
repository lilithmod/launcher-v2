package main

import (
	"embed"
	"fmt"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"

	"lilith/internal/update"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	app := NewApp()

	opt := &options.App{
		Title:       "Lilith Launcher",
		Width:       1160,
		Height:      646,
		Frameless:   true,
		AssetServer: &assetserver.Options{Assets: assets},
		OnDomReady:  app.domReady,
		OnShutdown:  app.shutdown,
		Bind:        []interface{}{app},
		Mac: &mac.Options{
			About: &mac.AboutInfo{
				Title:   fmt.Sprintf("Lilith Launcher v%v", update.Version),
				Message: "© 2021-2024 theMackabu, Lilith Development",
				Icon:    icon,
			},
		},
	}

	if runtime.GOOS == "linux" {
		opt.DisableResize = false
		opt.BackgroundColour = &options.RGBA{R: 0, G: 0, B: 0, A: 0}
	} else {
		opt.DisableResize = true
		opt.BackgroundColour = &options.RGBA{R: 23, G: 23, B: 23, A: 1}
	}

	err := wails.Run(opt)
	if err != nil {
		println("Error:", err.Error())
	}
}
