import java.io.IOException;
import java.io.RandomAccessFile;

class NextButton extends CommandButton {

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
                if (raf.length() > 0) {
                    readAddress(raf.length() - (RECORD_SIZE * 2));
                } else {
                    clearFields();
                }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
