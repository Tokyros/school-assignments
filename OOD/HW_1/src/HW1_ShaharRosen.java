//Shahar Rosen

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;
import javafx.stage.Stage;

import java.io.IOException;
import java.io.RandomAccessFile;

public class HW1_ShaharRosen extends Application {
    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        AddressBookPane pane = new AddressBookPane();
        Scene scene = new Scene(pane);
        scene.getStylesheets().add("styles.css");
        primaryStage.setTitle("AddressBook");
        primaryStage.setScene(scene);
        primaryStage.show();
        primaryStage.setAlwaysOnTop(true);
    }
}

class AddressBookPane extends GridPane {
    private RandomAccessFile raf;
    // Text fields
    private TextField jtfName = new TextField();
    private TextField jtfStreet = new TextField();
    private TextField jtfCity = new TextField();
    private TextField jtfState = new TextField();
    private TextField jtfZip = new TextField();
    // Buttons
    private AddButton jbtAdd;
    private FirstButton jbtFirst;
    private NextButton jbtNext;
    private PreviousButton jbtPrevious;
    private LastButton jbtLast;
    private Sort1Button jbtSort1;
    private Sort2Button jbtSort2;
    private IterButton jbtIter;
    public EventHandler<ActionEvent> ae =
            new EventHandler<ActionEvent>() {
                public void handle(ActionEvent arg0) {
                    ((Command) arg0.getSource()).Execute();
                }
            };

    public AddressBookPane() { // Open or create a random access file
        try {
            raf = new RandomAccessFile("address.dat", "rw");
        } catch (IOException ex) {
            System.out.print("Error: " + ex);
            System.exit(0);
        }
        jtfState.setAlignment(Pos.CENTER_LEFT);
        jtfState.setPrefWidth(25);
        jtfZip.setPrefWidth(60);
        jbtAdd = new AddButton(this, raf);
        jbtFirst = new FirstButton(this, raf);
        jbtNext = new NextButton(this, raf);
        jbtPrevious = new PreviousButton(this, raf);
        jbtLast = new LastButton(this, raf);
        jbtSort1 = new Sort1Button(this, raf);
        jbtSort2 = new Sort2Button(this, raf);
        jbtIter = new IterButton(this, raf);
        Label state = new Label("State");
        Label zp = new Label("Zip");
        Label name = new Label("Name");
        Label street = new Label("Street");
        Label city = new Label("City");
        // Panel p1 for holding labels Name, Street, and City
        GridPane p1 = new GridPane();
        p1.add(name, 0, 0);
        p1.add(street, 0, 1);
        p1.add(city, 0, 2);
        p1.setAlignment(Pos.CENTER_LEFT);
        p1.setVgap(8);
        p1.setPadding(new Insets(0, 2, 0, 2));
        GridPane.setVgrow(name, Priority.ALWAYS);
        GridPane.setVgrow(street, Priority.ALWAYS);
        GridPane.setVgrow(city, Priority.ALWAYS);
        // City Row
        GridPane adP = new GridPane();
        adP.add(jtfCity, 0, 0);
        adP.add(state, 1, 0);
        adP.add(jtfState, 2, 0);
        GridPane.setHgrow(jtfState, Priority.ALWAYS);
        adP.add(zp, 3, 0);
        adP.add(jtfZip, 4, 0);
        GridPane.setHgrow(jtfZip, Priority.ALWAYS);
        adP.setAlignment(Pos.CENTER_LEFT);
        GridPane.setHgrow(jtfCity, Priority.ALWAYS);
        GridPane.setVgrow(jtfCity, Priority.ALWAYS);
        GridPane.setVgrow(jtfState, Priority.ALWAYS);
        GridPane.setVgrow(jtfZip, Priority.ALWAYS);
        GridPane.setVgrow(state, Priority.ALWAYS);
        GridPane.setVgrow(zp, Priority.ALWAYS);
        // Panel p4 for holding jtfName, jtfStreet, and p3
        GridPane p4 = new GridPane();
        p4.add(jtfName, 0, 0);
        p4.add(jtfStreet, 0, 1);
        p4.add(adP, 0, 2);
        p4.setVgap(1);
        GridPane.setHgrow(jtfName, Priority.ALWAYS);
        GridPane.setHgrow(jtfStreet, Priority.ALWAYS);
        GridPane.setHgrow(adP, Priority.ALWAYS);
        GridPane.setVgrow(jtfName, Priority.ALWAYS);
        GridPane.setVgrow(jtfStreet, Priority.ALWAYS);
        GridPane.setVgrow(adP, Priority.ALWAYS);
        // Place p1 and p4 into jpAddress
        GridPane jpAddress = new GridPane();
        jpAddress.add(p1, 0, 0);
        jpAddress.add(p4, 1, 0);
        GridPane.setHgrow(p1, Priority.NEVER);
        GridPane.setHgrow(p4, Priority.ALWAYS);
        GridPane.setVgrow(p1, Priority.ALWAYS);
        GridPane.setVgrow(p4, Priority.ALWAYS);
        // Set the panel with line border
        jpAddress.setStyle("-fx-border-color: grey;"
                + " -fx-border-width: 1;"
                + " -fx-border-style: solid outside ;");
        // Add buttons to a panel
        FlowPane jpButton = new FlowPane();
        jpButton.setHgap(5);
        jpButton.getChildren().addAll(jbtAdd, jbtFirst,
                jbtNext, jbtPrevious, jbtLast, jbtSort1, jbtSort2, jbtIter);
        jpButton.setAlignment(Pos.CENTER);
        GridPane.setVgrow(jpButton, Priority.NEVER);
        GridPane.setVgrow(jpAddress, Priority.ALWAYS);
        GridPane.setHgrow(jpButton, Priority.ALWAYS);
        GridPane.setHgrow(jpAddress, Priority.ALWAYS);
        // Add jpAddress and jpButton to the stage
        this.setVgap(5);
        this.add(jpAddress, 0, 0);
        this.add(jpButton, 0, 1);
        jbtAdd.setOnAction(ae);
        jbtFirst.setOnAction(ae);
        jbtNext.setOnAction(ae);
        jbtPrevious.setOnAction(ae);
        jbtLast.setOnAction(ae);
        jbtSort1.setOnAction(ae);
        jbtSort2.setOnAction(ae);
        jbtIter.setOnAction(ae);
        jbtFirst.Execute();
    }

    public void actionHandled(ActionEvent e) {
        ((Command) e.getSource()).Execute();
    }

    public void SetName(String text) {
        jtfName.setText(text);
    }

    public void SetStreet(String text) {
        jtfStreet.setText(text);
    }

    public void SetCity(String text) {
        jtfCity.setText(text);
    }

    public void SetState(String text) {
        jtfState.setText(text);
    }

    public void SetZip(String text) {
        jtfZip.setText(text);
    }

    public String GetName() {
        return jtfName.getText();
    }

    public String GetStreet() {
        return jtfStreet.getText();
    }

    public String GetCity() {
        return jtfCity.getText();
    }

    public String GetState() {
        return jtfState.getText();
    }

    public String GetZip() {
        return jtfZip.getText();
    }
}








