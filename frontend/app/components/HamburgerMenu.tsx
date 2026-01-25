import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';
import { DARK_NEUTRAL } from '../../styles/theme';
import { createDimmedStyle } from '../../styles/dimming';
import { useDimming } from '../hooks/useDimming';
import { supabase } from '../../lib/supabase';

export default function HamburgerMenu() {
  const [menuVisible, setMenuVisible] = useState(false);
  const dimmed = useDimming();

  const handleSignOut = async () => {
    setMenuVisible(false);
    await supabase.auth.signOut();
  };

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <IconButton
          icon="menu"
          size={24}
          iconColor={DARK_NEUTRAL}
          onPress={() => setMenuVisible(true)}
          style={dimmed && styles.dimmed}
        />
      }
    >
      <Menu.Item onPress={handleSignOut} title="Sign out" leadingIcon="logout" />
    </Menu>
  );
}

const styles = StyleSheet.create({
  dimmed: createDimmedStyle(),
});
