export const testMicro = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted:", stream);
        alert("Microphone access granted. You can now use the microphone for audio input.");
        // Stop microphone stream after testing
        stream.getTracks().forEach(track => track.stop());

    } catch (error) {
        console.error("Error in testMicro:", error);
        alert("Error accessing microphone. Please check your browser settings and permissions.");
        throw error;
    }
}