function mySettings(props) {
  return (
    <Page>
      <Section
        description={<Text> Choose the colour your METAR will appear in here.</Text>}
        title={<Text bold align="center">Primary Colour Selection</Text>}>
        <ColorSelect
          settingsKey="primary-color"
          colors={[
            {color: 'tomato'},
            {color: 'sandybrown'},
            {color: 'gold'},
            {color: 'aquamarine'},
            {color: 'deepskyblue'},
            {color: 'plum'}
          ]}
        />
      </Section>
      <Section
        description={<Text> Enter your favourite METAR station.</Text>}
        title={<Text bold align="center">METAR Settings</Text>}>
        <TextInput
          title="Station Identifier"
          label="Station Identifier"
          placeholder="e.g. CYOW"
          settingsKey="station-identifier"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);