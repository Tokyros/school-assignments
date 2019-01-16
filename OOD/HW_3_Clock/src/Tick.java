import javafx.application.Platform;

import java.util.concurrent.locks.ReentrantLock;

public class Tick extends Thread {
    private ReentrantLock lock;
    private ClockPane clock;
    private int sleepTime = 1000;


    public Tick(ClockPane clock, ReentrantLock lock) {
        this.clock = clock;
        this.lock = lock;
    }

    @Override
    public void run() {
        try {
            while (true) {
                if (!lock.isLocked()) {
                    Platform.runLater(() -> {
                        clock.setCurrentTime();
                        if (new CalendarAdapter().getSecond() == 0) new AnnounceTimeOnSeparateThread().start();
                    });
                }

                Thread.sleep(sleepTime);
            }
        } catch (InterruptedException e) {
        }
    }
}