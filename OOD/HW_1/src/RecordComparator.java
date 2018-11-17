import java.util.Comparator;

public abstract class RecordComparator implements Comparator<String> {
    protected abstract int getBeginIndex();
    protected abstract int getEndIndex();

    protected String getStringToCompare(String s){
        return s.substring(getBeginIndex(), getEndIndex());
    }

    @Override
    public int compare(String o1, String o2) {
        return getStringToCompare(o1).compareTo(getStringToCompare(o2));
    }
}
