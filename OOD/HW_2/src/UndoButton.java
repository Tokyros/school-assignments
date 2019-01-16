import java.io.IOException;

public class UndoButton extends CommandButton {

    public UndoButton() {
        this.setText("Undo");
    }

    @Override
    public void Execute() {
        String undoneState = caretaker.undo();
        if (undoneState == null) {
            undoneState = "";
        }
        try {
            raf.seek(0);
            FixedLengthStringIO.writeFixedLengthString(undoneState, undoneState.length(), raf);
            raf.setLength(undoneState.length() * 2);
            if (raf.length() > 0) {
                raf.seek(raf.length() - (RECORD_SIZE * 2));
                readAddress(raf.getFilePointer());
            } else {
                clearFields();
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Could not write to file");
        }
    }
}
