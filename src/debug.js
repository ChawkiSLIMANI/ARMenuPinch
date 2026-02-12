export function initDebug() {
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'absolute';
    debugDiv.style.top = '10px';
    debugDiv.style.left = '10px';
    debugDiv.style.color = 'yellow';
    debugDiv.style.fontFamily = 'monospace';
    debugDiv.style.fontSize = '12px';
    debugDiv.style.zIndex = '9999';
    debugDiv.style.pointerEvents = 'none';
    debugDiv.style.whiteSpace = 'pre-wrap';
    debugDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
    debugDiv.style.padding = '5px';
    document.body.appendChild(debugDiv);

    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
        originalLog.apply(console, args);
        debugDiv.textContent += '[LOG] ' + args.join(' ') + '\n';
    };

    console.error = (...args) => {
        originalError.apply(console, args);
        debugDiv.textContent += '[ERR] ' + args.join(' ') + '\n';
    };

    window.onerror = (message) => {
        debugDiv.textContent += '[WIN ERR] ' + message + '\n';
    }
}
