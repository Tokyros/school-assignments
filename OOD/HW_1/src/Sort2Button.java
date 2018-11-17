import java.io.RandomAccessFile;
import java.util.Comparator;

class Sort2Button extends SortButton {
    public Sort2Button(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Sort2");
    }

    @Override
    ZipCodeComparator getComparator() {
        return new ZipCodeComparator();
    }
}
