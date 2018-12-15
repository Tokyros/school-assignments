public class AddressBookPaneEditButtonsDecorator extends AddressBookPaneDecorator {

    public AddressBookPaneEditButtonsDecorator(AddressBookPaneIFC addressBookPane) {
        super(addressBookPane);
        super.addButton(new AddButton());
        super.addButton(new UndoButton());
        super.addButton(new RedoButton());
    }
}
