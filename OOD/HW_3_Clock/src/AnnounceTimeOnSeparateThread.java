import java.applet.Applet;
import java.applet.AudioClip;
import java.util.Calendar;
import java.util.GregorianCalendar;

public class AnnounceTimeOnSeparateThread extends Thread {

    private AudioClip[] hourAudio = new AudioClip[12];
    private AudioClip[] minuteAudio = new AudioClip[60];

    private AudioClip amAudio = Applet.newAudioClip(this.getClass().getResource("/audio/am.au"));
    private AudioClip pmAudio = Applet.newAudioClip(this.getClass().getResource("/audio/pm.au"));

    public AnnounceTimeOnSeparateThread() {

        for (int i = 0; i < 12; i++)
            hourAudio[i] = Applet.newAudioClip(
                    this.getClass().getResource("/audio/hour" + i + ".au"));
        // Create audio clips for pronouncing minutes
        for (int i = 0; i < 60; i++)
            minuteAudio[i] = Applet.newAudioClip(
                    this.getClass().getResource("/audio/minute" + i + ".au"));
    }

    @Override
    public void run() {
        try {
            Calendar calendar = new GregorianCalendar();

            int second = calendar.get(Calendar.SECOND);

            if (second == 0) {
                readTime(calendar.get(Calendar.HOUR), calendar.get(Calendar.MINUTE));
            }
        } catch (InterruptedException ex) {
        }
    }

    private void readTime(int hour, int minute) throws InterruptedException {
        hourAudio[hour % 12].play();
        // Time delay to allow hourAudio play to finish
        Thread.sleep(1500);
        // Announce minute
        minuteAudio[minute].play();
        // Time delay to allow minuteAudio play to finish
        Thread.sleep(1500);
        // Announce am or pm
        if (hour < 12) amAudio.play();
        else pmAudio.play();
    }

}
