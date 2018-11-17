import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.Comparator;

class ZipCodeComparator implements Comparator<Long> {
    private RandomAccessFile raf;
    private int zipCodeSize;
    private int zipCodeOffset;

    public ZipCodeComparator(RandomAccessFile raf, int zipCodeSize, int zipCodeOffset) {
        this.raf = raf;
        this.zipCodeSize = zipCodeSize;
        this.zipCodeOffset = zipCodeOffset;
    }

    @Override
    public int compare(Long o1, Long o2) {
        try {
            raf.seek(o1 + zipCodeOffset);
            String zipCode1 = FixedLengthStringIO.readFixedLengthString(zipCodeSize, raf);
            Integer zipCodeNum1 = Integer.parseInt(zipCode1.trim());
            raf.seek(o2 + zipCodeOffset);
            String zipCode2 = FixedLengthStringIO.readFixedLengthString(zipCodeSize, raf);
            Integer zipCodeNum2 = Integer.parseInt(zipCode2.trim());
            return zipCodeNum1.compareTo(zipCodeNum2);
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }
}
