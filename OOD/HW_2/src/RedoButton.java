import java.io.IOException;
import java.io.RandomAccessFile;

public class RedoButton extends CommandButton {

    public RedoButton() {
        this.setText("Redo");
    }

    @Override
    public void Execute() {
        String redoneState = caretaker.redo();
        if (redoneState == null) {
            return;
        }
        try {
            raf.seek(0);
            FixedLengthStringIO.writeFixedLengthString(redoneState, redoneState.length(), raf);
            raf.setLength(redoneState.length() * 2);
            raf.seek(raf.length() - (RECORD_SIZE * 2));
            readAddress(raf.getFilePointer());
        } catch (IOException e) {
            System.out.println("Could not write to file");
        }
    }
}
