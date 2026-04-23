import { Redirect } from 'expo-router';

// Entry route: mirrors the old web behaviour (redirect "/" → "/signin").
export default function Index() {
  return <Redirect href="/signin" />;
}
