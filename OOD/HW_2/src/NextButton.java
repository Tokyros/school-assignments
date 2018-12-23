import java.io.IOException;
import java.io.RandomAccessFile;

class NextButton extends CommandButton {
//    public NextButton(BaseAddressBookPane pane, RandomAccessFile r) {
//        super(pane, r);
//        this.setText("Next");
//    }

    public NextButton() {
        this.setText("Next");
    }

    @Override
    public void Execute() {
        try {
            long currentPosition = raf.getFilePointer();
            if (currentPosition < raf.length())
                readAddress(currentPosition);
            else
                readAddress(currentPosition - (RECORD_SIZE * 2));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
