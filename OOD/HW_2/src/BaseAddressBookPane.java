import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;

public class BaseAddressBookPane extends GridPane implements AddressBookPaneIFC {
    public static final String MAIN_PAIN_STYLE = "-fx-border-color: grey;"
            + " -fx-border-width: 1;"
            + " -fx-border-style: solid outside ;";
    private RandomAccessFile addressBookFile;

    private TextField nameField = new TextField();
    private TextField streetField = new TextField();
    private TextField cityField = new TextField();
    private TextField stateField = new TextField();
    private TextField zipField = new TextField();

    public EventHandler<ActionEvent> commandBtnEventHandler = ev -> ((Command) ev.getSource()).Execute();

    public BaseAddressBookPane() {
        readAddressBookFile();

        this.add(getMainPane(), 0, 0);

        this.add(getButtonPane(), 0, 1);

        this.setVgap(5);
    }

    private FlowPane getButtonPane() {
        FlowPane buttonPane = new FlowPane();
        buttonPane.setHgap(5);

        buttonPane.setAlignment(Pos.CENTER);
        GridPane.setVgrow(buttonPane, Priority.NEVER);
        GridPane.setHgrow(buttonPane, Priority.ALWAYS);

        buttonPane.getChildren().addAll(getButtons());
        return buttonPane;
    }

    private GridPane getMainPane() {
        GridPane mainPane = new GridPane();

        mainPane.add(getLabelsPane(), 0, 0);
        mainPane.add(getNameAndStreetPane(), 1, 0);

        mainPane.setStyle(MAIN_PAIN_STYLE);
        GridPane.setVgrow(mainPane, Priority.ALWAYS);
        GridPane.setHgrow(mainPane, Priority.ALWAYS);
        return mainPane;
    }

    private GridPane getNameAndStreetPane() {
        GridPane nameAndStreetPane = new GridPane();

        nameAndStreetPane.add(this.nameField, 0, 0);
        GridPane.setHgrow(this.nameField, Priority.ALWAYS);
        GridPane.setVgrow(this.nameField, Priority.ALWAYS);

        nameAndStreetPane.add(this.streetField, 0, 1);
        GridPane.setHgrow(this.streetField, Priority.ALWAYS);
        GridPane.setVgrow(this.streetField, Priority.ALWAYS);

        nameAndStreetPane.add(getStateCityAndZipPane(), 0, 2);

        nameAndStreetPane.setVgap(1);

        GridPane.setHgrow(nameAndStreetPane, Priority.ALWAYS);
        GridPane.setVgrow(nameAndStreetPane, Priority.ALWAYS);

        return nameAndStreetPane;
    }

    private GridPane getStateCityAndZipPane() {
        GridPane stateCityAndZipPane = new GridPane();

        stateCityAndZipPane.add(this.cityField, 0, 0);
        GridPane.setHgrow(this.cityField, Priority.ALWAYS);
        GridPane.setVgrow(this.cityField, Priority.ALWAYS);

        Label stateLabel = new Label("State");
        stateCityAndZipPane.add(stateLabel, 1, 0);

        stateCityAndZipPane.add(this.stateField, 2, 0);
        GridPane.setVgrow(this.stateField, Priority.ALWAYS);
        stateField.setAlignment(Pos.CENTER_LEFT);
        stateField.setPrefWidth(25);

        GridPane.setVgrow(stateLabel, Priority.ALWAYS);

        Label zipLabel = new Label("Zip");
        stateCityAndZipPane.add(zipLabel, 3, 0);

        stateCityAndZipPane.add(zipField, 4, 0);
        GridPane.setVgrow(zipField, Priority.ALWAYS);
        zipField.setPrefWidth(60);

        GridPane.setVgrow(zipLabel, Priority.ALWAYS);

        stateCityAndZipPane.setAlignment(Pos.CENTER_LEFT);
        GridPane.setHgrow(stateCityAndZipPane, Priority.ALWAYS);
        GridPane.setVgrow(stateCityAndZipPane, Priority.ALWAYS);

        return stateCityAndZipPane;
    }

    private GridPane getLabelsPane() {
        GridPane labelsPane = new GridPane();
        GridPane.setHgrow(labelsPane, Priority.NEVER);
        GridPane.setVgrow(labelsPane, Priority.ALWAYS);

        Label nameLabel = new Label("Name");
        labelsPane.add(nameLabel, 0, 0);
        GridPane.setVgrow(nameLabel, Priority.ALWAYS);

        Label streetLabel = new Label("Street");
        labelsPane.add(streetLabel, 0, 1);
        GridPane.setVgrow(streetLabel, Priority.ALWAYS);

        Label cityLabel = new Label("City");
        labelsPane.add(cityLabel, 0, 2);
        GridPane.setVgrow(cityLabel, Priority.ALWAYS);

        labelsPane.setAlignment(Pos.CENTER_LEFT);
        labelsPane.setVgap(8);
        labelsPane.setPadding(new Insets(0, 2, 0, 2));

        return labelsPane;
    }

    private void readAddressBookFile() {
        try {
            addressBookFile = new RandomAccessFile("address.dat", "rw");
        } catch (IOException ex) {
            System.out.print("Error: " + ex);
            System.exit(0);
        }
    }

    public void SetName(String text) {
        nameField.setText(text);
    }

    public void SetStreet(String text) {
        streetField.setText(text);
    }

    public void SetCity(String text) {
        cityField.setText(text);
    }

    public void SetState(String text) {
        stateField.setText(text);
    }

    public void SetZip(String text) {
        zipField.setText(text);
    }

    public String GetName() {
        return nameField.getText();
    }

    public String GetStreet() {
        return streetField.getText();
    }

    public String GetCity() {
        return cityField.getText();
    }

    public String GetState() {
        return stateField.getText();
    }

    public String GetZip() {
        return zipField.getText();
    }

    @Override
    public ArrayList<CommandButton> getButtons() {
        ArrayList<CommandButton> buttons = new ArrayList<>();

        AddButton addBtn = new AddButton(this, addressBookFile);
        addBtn.setOnAction(commandBtnEventHandler);
        buttons.add(addBtn);

        FirstButton firstBtn = new FirstButton(this, addressBookFile);
        firstBtn.setOnAction(commandBtnEventHandler);
        buttons.add(firstBtn);

        NextButton nextBtn = new NextButton(this, addressBookFile);
        nextBtn.setOnAction(commandBtnEventHandler);
        buttons.add(nextBtn);

        PreviousButton previousBtn = new PreviousButton(this, addressBookFile);
        previousBtn.setOnAction(commandBtnEventHandler);
        buttons.add(previousBtn);

        LastButton lastBtn = new LastButton(this, addressBookFile);
        lastBtn.setOnAction(commandBtnEventHandler);
        buttons.add(lastBtn);

        return buttons;
    }
}
