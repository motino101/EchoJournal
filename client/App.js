import { Box, GluestackUIProvider, Text } from '@gluestack-ui/themed';
import { config } from './config/gluestack-ui.config';

import { NavigationContainer } from '@react-navigation/native';

import AppContextProvider from './AppContextProvider';
import ListView from './screens/ListView';
import EntryView from './screens/EntryView';
import RecordScreen from './screens/RecordScreen';
import WidgetView from './screens/WidgetView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AddIcon, SunIcon, MenuIcon, Icon } from '@gluestack-ui/themed';

const Tab = createBottomTabNavigator();

const tabNavigatorScreenOptions = ({ route }) => ({
  // the header is quite ugly and the content should make it obvious which screen the user is looking at
  headerShown: false,

  // we don't want the icons in the navbar to have a text label for the sake of reducing clutter
  tabBarLabel: '',

  tabBarStyle: {
    // TODO: figure out why we can't use $background900 here even though it's inside of the gluestack provider
    backgroundColor: '#262626',

    // without this, a really awkward thin white line appears separating the navbar from the content above above
    borderTopColor: 'transparent',
  },
  tabBarIcon: ({ focused }) => {
    // the icon that should be rendered for each specific screen in the navbar
    let iconName;

    if (route.name === 'WidgetView') {
      iconName = SunIcon;
    } else if (route.name === 'RecordScreen') {
      iconName = AddIcon;
    } else if (route.name === 'ListView') {
      iconName = MenuIcon;
    }

    return (
      <Box alignItems='center'>
        <Icon
          as={iconName}
          size='xl'
          // TODO: figure out why we can't use $background900 for the color even though it's inside of the gluestack provider
          color={focused ? 'white' : 'gray'}
          style={{ alignSelf: 'center' }}
        />

        {
          // JS hack to return entity only if something is true
          focused && (
            <Text
              fontWeight='bold'
              position='absolute'
              bottom='-70%'
            >
              {/* ___ */}
            </Text>
          )
        }
      </Box>
    );
  },
});

export default function App() {
  return (
    <GluestackUIProvider
      config={config}
      colorMode='dark'
    >
      <AppContextProvider>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName='ListView'
            screenOptions={tabNavigatorScreenOptions}
          >
            <Tab.Screen
              name='EntryView'
              component={EntryView}
              options={{
                // prevents this screen from showing up in navbar. EntryView should be hidden because it shouldn't be directly accessible from anywhere - the user should only be able to click into it when coming from ListView
                tabBarButton: () => null,

                // comment this back in if you don't want to see the tab bar when in this component
                // tabBarVisible: false,
              }}
            />
            <Tab.Screen
              name='WidgetView'
              component={WidgetView}
            />
            <Tab.Screen
              name='RecordScreen'
              component={RecordScreen}
            />
            <Tab.Screen
              name='ListView'
              component={ListView}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </AppContextProvider>
    </GluestackUIProvider>
  );
}
