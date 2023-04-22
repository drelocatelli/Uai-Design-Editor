class Archive {
    static createBlob(content: any, mimeType?: string) {
        mimeType = mimeType ?? 'text/plain';
        const blob = new Blob([content], {type: mimeType});
        return blob;
    }

    static download(filename: string, ext: string, blob: Blob) {
        filename = filename ?? new Date().getTime();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.${ext}`;                        
        document.body.append(link);
        link.click();
    }

}


export default Archive;