import java.io.IOException;
import java.io.RandomAccessFile;

class NextButton extends CommandButton {
    public NextButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Next");
    }

    @Override
    public void Execute() {
        try {
            long currentPosition = raf.getFilePointer();
            if (currentPosition < raf.length())
                readAddress(currentPosition);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}