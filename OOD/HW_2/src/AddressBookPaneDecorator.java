import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;

public class AddressBookPaneDecorator extends AddressBookPaneIFC {
    private AddressBookPaneIFC coreAddressBookPane;

    public AddressBookPaneDecorator(AddressBookPaneIFC coreAddressBookPane) {
        this.coreAddressBookPane = coreAddressBookPane;
        this.getChildren().add(this.coreAddressBookPane);
        GridPane.setHgrow(coreAddressBookPane, Priority.ALWAYS);
        GridPane.setVgrow(coreAddressBookPane, Priority.ALWAYS);
    }

    @Override
    public void addButton(CommandButton button) {
        coreAddressBookPane.addButton(button);
    }
}
