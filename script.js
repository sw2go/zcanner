class Scanner {
    constructor(scanDialog, dialogClose, sourceSelectPanel, sourceSelect, resultInput) {
        this.scanDialog = scanDialog;
        this.span = dialogClose;
        this.sourceSelectPanel = sourceSelectPanel;
        this.sourceSelect = sourceSelect;
        this.scanResult = resultInput;
        this.codeReader = null;
        this.selectedDeviceId = null;
    }

    Init() {
        if (!this.codeReader) {
            this.sourceSelectPanel.style.display = "none";
            this.codeReader = new ZXing.BrowserMultiFormatReader();
            this.codeReader.getVideoInputDevices()
            .then((videoInputDevices) => {
                this.selectedDeviceId = videoInputDevices[0].deviceId;
                console.log(`${videoInputDevices.length} video input(s) available`);
                if (videoInputDevices.length >= 1) { 

                    videoInputDevices.forEach((element) => {
                        const sourceOption = document.createElement('option')
                        sourceOption.text = element.label
                        sourceOption.value = element.deviceId
                        this.sourceSelect.appendChild(sourceOption)
                      });         
                    
                    this.sourceSelect.onchange = () => {
                        this.selectedDeviceId = this.sourceSelect.value;
                    };

                    this.sourceSelectPanel.style.display = 'block';
                }
            })
            .catch((err) => {
                console.error(err);
            });
        }
    }

    Read() {
        console.log("start scanner");
        this.scanResult.value = '';
        this.scanDialog.style.display = "block";
        this.codeReader.decodeFromVideoDevice(this.selectedDeviceId, 'video', (result, err) => {
            if (result) {
                console.log(result);
                this.scanResult.value = result.text;
                this.Stop();
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error(err)
                this.scanResult.value = err;
                this.Stop();
            }
        });
        console.log(`Started continous decode from camera with id ${this.selectedDeviceId}`);
    };

    Stop() {
        console.log("stop scanner");
        this.scanDialog.style.display = "none";
        this.codeReader.reset();
    };
}