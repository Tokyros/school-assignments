import java.io.RandomAccessFile;
import java.util.*;

class IterButton extends CommandButton {
    private boolean wasClicked = false;
    private ListIterator<String> lit = iterator();
    LinkedHashMap<String, String> recordsMap = new LinkedHashMap<>();

    public IterButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Iter");
    }

    private void rewindIterator() {
        while (lit.hasPrevious()) {
            lit.previous();
        }
    }

    private void removeDuplicates(){
        rewindIterator();

        while (lit.hasNext()) {
            String record = lit.next();
            String key = record.substring(0, (CommandButton.NAME_SIZE + CommandButton.CITY_SIZE + CommandButton.STATE_SIZE + CommandButton.STREET_SIZE));
            recordsMap.put(key, record);
        }

        readFromIterator(recordsMap.values().iterator());
    }

    private void sortRecords(){
        rewindIterator();

        TreeSet<String> treeSet = new TreeSet<>(new StreetComparator());

        treeSet.addAll(recordsMap.values());

        readFromIterator(treeSet.iterator());
    }

    private void readFromIterator(Iterator<String> iterator) {
        rewindIterator();
        while (iterator.hasNext()) {
            if (lit.hasNext()) {
                lit.next();
                lit.set(iterator.next());
            } else {
                lit.add(iterator.next());
                lit.next();
            }
        }

        while (lit.hasNext()) {
            lit.next();
            lit.remove();
        }
    }


    @Override
    public void Execute() {
        if (!wasClicked) {
            removeDuplicates();
            wasClicked = true;
        } else {
            sortRecords();
        }

        new FirstButton(p, raf).Execute();
    }
}
