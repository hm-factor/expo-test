// import { StatusBar } from 'expo-status-bar';
import { useState } from 'react/cjs/react.development';
import {
  Platform, 
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import * as ImagePicker from 'expo-image-picker';
import * as Sharing from "expo-sharing";
import uploadToAnonymousFilesAsync from "anonymous-files";

// import logo from './assets/logo.png';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
     if (pickerResult.cancelled) {
      return;
    }

    if (Platform.OS === "web") {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  };
  
  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(
        `The image is available for sharing at: ${selectedImage.remoteUri}`
      );
      return;
    }

    Sharing.shareAsync(selectedImage.remoteUri || selectedImage.localUri);
  }; 

  if (selectedImage) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.btn}>
          <Text style={styles.btnText}>Share this photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.imgur.com/TkIrScD.png" }}
        style={styles.logo}
      />
      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button
        below!
      </Text>

      <TouchableOpacity style={styles.btn} onPress={openImagePickerAsync}>
        <Text style={styles.btnText}>Pick a photo!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    fontSize: 18,
    color: '#888',
    marginHorizontal: 15
  },
  logo: {
    width: 305,
    height:159,
    marginBottom: 10
  },
  btn: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 20
  },
  btnText: {
    fontSize: 20,
    color: '#fff'
  }
});
