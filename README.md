<p align="center"><img style="width: 300px;" src="https://lilith.rip/images/lilith-text.png"></p>

##

[![Build](https://github.com/lilithmod/launcher-v2/actions/workflows/build.yml/badge.svg)](https://github.com/lilithmod/launcher-v2/actions/workflows/build.yml) [![Version](https://img.shields.io/badge/Version-0.4.0-%23EF2D5C.svg)](https://github.com/lilithmod/launcher-v2/releases/latest) [![Go](https://img.shields.io/badge/Powered_by-Golang-%2300ADD8.svg?style=flat&logoColor=white)]() [![Go Version](https://img.shields.io/github/go-mod/go-version/lilithmod/launcher-v2.svg)](https://github.com/lilithmod/launcher-v2/blob/master/go.mod) [![Maid](https://img.shields.io/badge/Uses-Maid-%23FF8BBF.svg?style=flat&logoColor=white)](https://github.com/exact-labs/maid)

Lilith is the next generation of Hypixel overlay. View more information at https://lilith.rip

<img style="height: 300px;" src="https://github.com/lilithmod/launcher-v2/blob/master/.github/assets/screenshot.png">

### Installation

Pre-built binaries for Linux, MacOS, and Windows can be found on the [releases](https://github.com/lilithmod/launcher-v2/releases) page.

### Building

- Clone the project using `git clone https://github.com/lilithmod/launcher-v2`
- Open a terminal in the project folder
- Check if you have go installed, just type in `go version` _(Make sure you are using go1.22+)_
- Install wails using `go install github.com/wailsapp/wails/v2/cmd/wails@latest`
- To build for your platform, run `wails build --clean`
