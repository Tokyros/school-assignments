import java.util.Comparator;

class StreetComparator implements Comparator<String> {
    @Override
    public int compare(String o1, String o2) {
            int streetAddressOffset = CommandButton.NAME_SIZE;
            int streetAddressSize = CommandButton.STREET_SIZE;

            String streetAddress1 = o1.substring(streetAddressOffset, streetAddressOffset + streetAddressSize);
            String streetAddress2 = o2.substring(streetAddressOffset, streetAddressOffset + streetAddressSize);

            int comparison = streetAddress1.compareTo(streetAddress2);

            if (comparison == 0) {
                return o1.compareTo(o2);
            } else {
                return comparison;
            }
    }
}
