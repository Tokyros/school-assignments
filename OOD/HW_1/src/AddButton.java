import java.io.RandomAccessFile;

class AddButton extends CommandButton {
    public AddButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Add");
    }

    @Override
    public void Execute() {
        writeAddress();
    }
}