import java.util.GregorianCalendar;

public class CalendarAdapter extends GregorianCalendar {
    public int getHour() {
        return this.get(HOUR_OF_DAY);
    }

    public int getMinute() {
        return this.get(MINUTE);
    }

    public int getSecond() {
        return this.get(SECOND);
    }
}
