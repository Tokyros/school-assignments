import javafx.scene.control.Button;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ListIterator;
import java.util.NoSuchElementException;

interface Command {
    void Execute();
}

class CommandButton extends Button implements Command {
    public final static int NAME_SIZE = 32;
    public final static int STREET_SIZE = 32;
    public final static int CITY_SIZE = 20;
    public final static int STATE_SIZE = 10;
    public final static int ZIP_SIZE = 5;
    public final static int RECORD_SIZE =
            (NAME_SIZE + STREET_SIZE + CITY_SIZE + STATE_SIZE + ZIP_SIZE);
    protected AddressBookPane p;
    protected RandomAccessFile raf;

    public CommandButton(AddressBookPane pane, RandomAccessFile r) {
        super();
        p = pane;
        raf = r;
    }

    public void Execute() {
    }

    /**
     * Write a record at the end of the file
     */
    public void writeAddress() {
        try {
            raf.seek(raf.length());
            FixedLengthStringIO.writeFixedLengthString(p.GetName(),
                    NAME_SIZE, raf);
            FixedLengthStringIO.writeFixedLengthString(p.GetStreet(),
                    STREET_SIZE, raf);
            FixedLengthStringIO.writeFixedLengthString(p.GetCity(),
                    CITY_SIZE, raf);
            FixedLengthStringIO.writeFixedLengthString(p.GetState(),
                    STATE_SIZE, raf);
            FixedLengthStringIO.writeFixedLengthString(p.GetZip(),
                    ZIP_SIZE, raf);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    /**
     * Read a record at the specified position
     */
    public void readAddress(long position) throws IOException {
        raf.seek(position);
        String name =
                FixedLengthStringIO.readFixedLengthString(NAME_SIZE, raf);
        String street =
                FixedLengthStringIO.readFixedLengthString(STREET_SIZE, raf);
        String city =
                FixedLengthStringIO.readFixedLengthString(CITY_SIZE, raf);
        String state =
                FixedLengthStringIO.readFixedLengthString(STATE_SIZE, raf);
        String zip =
                FixedLengthStringIO.readFixedLengthString(ZIP_SIZE, raf);
        p.SetName(name);
        p.SetStreet(street);
        p.SetCity(city);
        p.SetState(state);
        p.SetZip(zip);
    }

    public AddressIterator iterator(){
        return new AddressIterator(raf);
    }

    private class AddressIterator implements ListIterator<String> {
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
}