import { StyleSheet, TextInput, View } from 'react-native'
import Divider from '../Divider'
import { Rounded, Spacing } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import Button from '../Themes/Button'
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'

const SearchForm = ({
    searchValue, 
    setSearchValue, 
    onSearch,
    searchLoading
  } : {
    searchValue: string, 
    setSearchValue: any, 
    onSearch: any,
    searchLoading: boolean
  }
) => {
  return (<>
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput 
          value={searchValue} 
          onChangeText={(text) => {setSearchValue(text)}} 
          placeholder={'جستجو ...'}
          placeholderTextColor={Colors.caption}
          style={styles.input}
        />
        <Button 
          varient='iconButton' 
          Icon={MagnifyingGlassIcon} 
          iconOptions={{color: Colors.white}} 
          onPress={onSearch} 
          loading={searchLoading}
          disabled={searchLoading}
        />
      </View>
      {/* <Button 
        varient='iconButton' 
        Icon={FunnelIcon} 
        iconOptions={{color: Colors.white}}
        style={{
          borderColor: Colors.whiteAlpha2,
          borderWidth: 1,
          borderRadius: Rounded.md,
          width: 56,
          height: 56
        }}
      /> */}
    </View>
    <Divider style={{paddingHorizontal: Spacing[2] }} />
  </>)
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    paddingHorizontal: Spacing[2],
    flexDirection: 'row-reverse',
    gap: Spacing[1],
    paddingTop: Spacing[1]
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.whiteAlpha2,
    borderRadius: Rounded.md,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    height: 56,
    flex: 1,
  },
  input: {
    textAlign: 'right',
    padding: Spacing[1],
    color: Colors.text,
    flex: 1,
  }
})

export default SearchForm