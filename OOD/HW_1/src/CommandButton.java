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
        return new AddressIterator();
    }

    private class AddressIterator implements ListIterator<String> {
        private int cursor = 0;
        private boolean canExecuteEditOperations = false;

        private int size() {
            try {
                return (int) raf.length() / (RECORD_SIZE * 2);
            } catch (IOException e) {
                e.printStackTrace();
                return -1;
            }
        }

        private void seekIndex(int index) throws IOException {
            raf.seek(index * RECORD_SIZE * 2);
        }

        private String readToEndOfFile() throws IOException {
            seekIndex(nextIndex());
            int sizeToEndOfFile = (size() - nextIndex()) * RECORD_SIZE;
            return FixedLengthStringIO.readFixedLengthString(sizeToEndOfFile , raf);
        }

        @Override
        public boolean hasNext() {
            return cursor < size();
        }

        @Override
        public String next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }

            try {
                seekIndex(nextIndex());
                cursor++;
                canExecuteEditOperations = true;
                return FixedLengthStringIO.readFixedLengthString(RECORD_SIZE, raf);
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        public boolean hasPrevious() {
            return cursor > 0;
        }

        @Override
        public String previous() {
            if (!hasPrevious()) {
                throw new NoSuchElementException();
            }

            try {
                seekIndex(previousIndex());
                cursor--;
                canExecuteEditOperations = true;
                return FixedLengthStringIO.readFixedLengthString(RECORD_SIZE, raf);
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        public int nextIndex() {
            return cursor;
        }

        @Override
        public int previousIndex() {
            return cursor - 1;
        }

        @Override
        public void remove() {
            try {
                if (canExecuteEditOperations) {
                    canExecuteEditOperations = false;
                    String fileAfterRecordToRemove = readToEndOfFile();
                    seekIndex(previousIndex());
                    FixedLengthStringIO.writeFixedLengthString(fileAfterRecordToRemove, fileAfterRecordToRemove.length(), raf);
                    raf.setLength(raf.length() - (RECORD_SIZE * 2));
                    cursor--;
                } else {
                    throw new IllegalStateException();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void set(String s) {
            try {
                if (canExecuteEditOperations) {
                    raf.seek(previousIndex() * RECORD_SIZE * 2);
                    FixedLengthStringIO.writeFixedLengthString(s, RECORD_SIZE, raf);
                } else {
                    throw new IllegalStateException();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void add(String s) {
            try {
                if (canExecuteEditOperations) {
                    canExecuteEditOperations = false;
                    String fileAfterRecordToAdd = readToEndOfFile();
                    seekIndex(nextIndex());
                    FixedLengthStringIO.writeFixedLengthString(s, RECORD_SIZE, raf);
                    FixedLengthStringIO.writeFixedLengthString(fileAfterRecordToAdd, fileAfterRecordToAdd.length(), raf);
                    cursor++;
                } else {
                    throw new IllegalStateException();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}