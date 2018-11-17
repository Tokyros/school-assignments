import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.Comparator;

class RecordNameComparator implements Comparator<Long> {
    private RandomAccessFile raf;
    private int nameSize;

    public RecordNameComparator(RandomAccessFile raf, int nameSize) {
        this.raf = raf;
        this.nameSize = nameSize;
    }
    @Override
    public int compare(Long o1, Long o2) {
        try {
            this.raf.seek(o1);
            String name1 = FixedLengthStringIO.readFixedLengthString(nameSize, raf);
            this.raf.seek(o2);
            String name2 = FixedLengthStringIO.readFixedLengthString(nameSize, raf);
            return name1.compareTo(name2);
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }
}
