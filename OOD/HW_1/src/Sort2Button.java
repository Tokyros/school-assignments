import java.io.RandomAccessFile;
import java.util.Comparator;

class Sort2Button extends SortButton {
    public Sort2Button(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Sort2");
    }

    @Override
    Comparator<Long> getComparator() {
        int zipCodeOffset = 2 * (NAME_SIZE + CITY_SIZE + STREET_SIZE + STATE_SIZE);
        return new ZipCodeComparator(raf, ZIP_SIZE, zipCodeOffset);
    }
}
