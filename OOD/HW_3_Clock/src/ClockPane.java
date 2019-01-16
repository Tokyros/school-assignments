import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Line;
import javafx.scene.text.Text;

import java.util.concurrent.locks.ReentrantLock;

public class ClockPane extends Pane {
    private int hour;
    private int minute;
    private int second;
    private double w = 250, h = 250;

    private ReentrantLock lock = new ReentrantLock();
    private Tick tick = new Tick(this, lock);

    public void pause() {
        lock.lock();
    }

    public  void play() {
        lock.unlock();
    }


    /**
     * Construct a default clock with the current time
     */
    public ClockPane() {
        setCurrentTime();
        tick.start();
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
        paintClock();
    }

    public int getMinute() {
        return minute;
    }

    public void setMinute(int minute) {
        this.minute = minute;
        paintClock();
    }

    public int getSecond() {
        return second;
    }

    public void setSecond(int second) {
        this.second = second;
        paintClock();
    }

    public double getW() {
        return w;
    }

    public void setW(double w) {
        this.w = w;
        paintClock();
    }

    public double getH() {
        return h;
    }

    public void setH(double h) {
        this.h = h;
        paintClock();
    }

    public void setCurrentTime() {
        CalendarAdapter calendar = new CalendarAdapter();
        this.hour = calendar.getHour();
        this.minute = calendar.getMinute();
        this.second = calendar.getSecond();
        paintClock(); // Repaint the clock
    }

    private void paintClock() {  // Initialize clock parameters
        double clockRadius = Math.min(w, h) * 0.8 * 0.5;
        double centerX = w / 2;
        double centerY = h / 2;

        Circle circle = getCircle(clockRadius, centerX, centerY);

        Text t1 = new Text(centerX - 5, centerY - clockRadius + 12, "12");
        Text t2 = new Text(centerX - clockRadius + 3, centerY + 5, "9");
        Text t3 = new Text(centerX + clockRadius - 10, centerY + 3, "3");
        Text t4 = new Text(centerX - 3, centerY + clockRadius - 3, "6");

        Line secondsHand = getHand(clockRadius, centerX, centerY, 0.8, second, 60, Color.RED);
        Line minutesHand = getHand(clockRadius, centerX, centerY, 0.65, minute, 60, Color.BLUE);
        Line hoursHand = getHand(clockRadius, centerX, centerY, 0.5, (int) (hour % 12 + minute / 60.0), 12, Color.GREEN);

        getChildren().clear();
        getChildren().addAll(circle, t1, t2, t3, t4, secondsHand, minutesHand, hoursHand);
    }

    private Line getHand(double clockRadius, double centerX, double centerY, double length, int second, int i, Color handColor) {
        double handLength = clockRadius * length;
        double handX = centerX + handLength
                * Math.sin(second * (2 * Math.PI / i));
        double handY = centerY - handLength
                * Math.cos(second * (2 * Math.PI / i));
        Line hand = new Line(centerX, centerY, handX, handY);
        hand.setStroke(handColor);
        return hand;
    }

    private Circle getCircle(double clockRadius, double centerX, double centerY) {
        // Draw circle
        Circle circle = new Circle(centerX, centerY, clockRadius);
        circle.setFill(Color.WHITE);
        circle.setStroke(Color.BLACK);
        return circle;
    }
}
