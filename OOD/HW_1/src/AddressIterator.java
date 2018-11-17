import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ListIterator;
import java.util.NoSuchElementException;

class AddressIterator implements ListIterator<String> {
    private RandomAccessFile raf;
    private boolean canSetAddOrRemove = false;

    public AddressIterator(RandomAccessFile raf) {
        this.raf = raf;
    }

    private int size () {
        try {
            return positionToIndex(raf.length());
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }

    private int positionToIndex(long position) {
        return (int) position / (CommandButton.RECORD_SIZE * 2);
    }

    private long indexToPosition(int index) {
        return index * CommandButton.RECORD_SIZE * 2;
    }

    @Override
    public boolean hasNext() {
        return nextIndex() < size();
    }

    @Override
    public String next() {
        if (!hasNext()) {
            throw new NoSuchElementException();
        }
        try {
            String next = FixedLengthStringIO.readFixedLengthString(CommandButton.RECORD_SIZE, raf);
            canSetAddOrRemove = true;
            return next;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public boolean hasPrevious() {
        return previousIndex() >= 0;
    }

    @Override
    public String previous() {
        if (!hasPrevious()) {
            throw new NoSuchElementException();
        }
        try {
            raf.seek(indexToPosition(previousIndex()));
            String previous = FixedLengthStringIO.readFixedLengthString(CommandButton.RECORD_SIZE, raf);
            canSetAddOrRemove = true;
            return previous;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public int nextIndex() {
        try {
            return positionToIndex(raf.getFilePointer());
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    public int previousIndex() {
        int nextIndex = nextIndex();
        return nextIndex - 2 >= 0 ? nextIndex - 2 : -1;
    }

    @Override
    public void remove() {
        if (!canSetAddOrRemove) {
            throw new IllegalStateException();
        }
        try {
            int indexToRemove = previousIndex() + 1;
            long positionToRemove = indexToPosition(indexToRemove);
            int restOfFileSize = (int) indexToPosition(size() - 1 - indexToRemove);
            String restOfFile = FixedLengthStringIO.readFixedLengthString(restOfFileSize/2, raf);
            raf.seek(positionToRemove);
            FixedLengthStringIO.writeFixedLengthString(restOfFile, restOfFileSize/2, raf);
            raf.setLength(raf.length() - (CommandButton.RECORD_SIZE * 2));
            raf.seek(positionToRemove);
            canSetAddOrRemove = false;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void set(String s) {
        if (!canSetAddOrRemove) {
            throw new IllegalStateException();
        }
        try {
            int indexToSet = previousIndex() + 1;
            long positionToSet = indexToPosition(indexToSet);
            raf.seek(positionToSet);
            FixedLengthStringIO.writeFixedLengthString(s, CommandButton.RECORD_SIZE, raf);
            canSetAddOrRemove = false;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void add(String s) {
        if (!canSetAddOrRemove) {
            throw new IllegalStateException();
        }
        try {
            int indexToAdd = previousIndex() + 1;
            long positionToAdd = indexToPosition(indexToAdd);
            int restOfFileSize = (int) indexToPosition(size() - 1 - indexToAdd);
            raf.seek(positionToAdd);
            String restOfFile = FixedLengthStringIO.readFixedLengthString(restOfFileSize/2, raf);
            raf.seek(positionToAdd);
            FixedLengthStringIO.writeFixedLengthString(s, CommandButton.RECORD_SIZE, raf);
            FixedLengthStringIO.writeFixedLengthString(restOfFile, restOfFileSize/2, raf);
            raf.seek(positionToAdd + CommandButton.RECORD_SIZE * 2);
            canSetAddOrRemove = false;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
