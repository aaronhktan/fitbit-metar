function mySettings(props) {
  return (
    <Page>
      <Section
        description={<Text> Choose the colour your METAR will appear in here.</Text>}
        title={<Text bold align='center'>Primary Colour Selection</Text>}>
        <ColorSelect
          settingsKey='primary-color'
          colors={[
            {color: 'tomato'},
            {color: 'sandybrown'},
            {color: 'gold'},
            {color: 'aquamarine'},
            {color: 'deepskyblue'},
            {color: 'plum'},
            {color: 'white'}
          ]}
        />
      </Section>
      <Section
        description={<Text> Enter up to five of your favourite METAR stations.</Text>}
        title={<Text bold align='center'>METAR Settings</Text>}>
        <AdditiveList
          settingsKey='station-identifiers'
          maxItems='5'
          addAction= {
            <TextInput
              title='Favourite Stations'
              label='Add a station'
              placeholder='e.g. CYOW'
            />
          }
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);