import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 14,
    backgroundColor: COLORS.gray,
    color: COLORS.darkGray,
  },
  text: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginVertical: 10,
  },
  subHeading: {
    fontSize: 16,
    color: COLORS.mediumGray,
    marginVertical: 5,
  },
});
