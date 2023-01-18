

/************pcd05 *********************/

const firebaseConfig = {
  apiKey: "AIzaSyCTFR5KDkREMUwVakho8W-ZlG2oQMlEWQo",
  authDomain: "starting-c9365.firebaseapp.com",
  projectId: "starting-c9365",
  storageBucket: "starting-c9365.appspot.com",
  messagingSenderId: "695864180075",
  appId: "1:695864180075:web:b6cebe59b69d5eae10202e",
  measurementId: "G-TKBE7V3DYF"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase);

const db = firebase.firestore();



chrome.runtime.onMessage.addListener((msg, sender, resp) => {


  if (msg.command == 'remove') {
      db.collection('quotation-data').doc(msg.data.remove.ID).delete();
  }

  if (msg.command == 'post') {
    db.collection('quotation-data')
    .add({ data: msg.data })
    .then(() => {
      console.log('data added');
    })
    .catch(err => {
      console.log(err);
    })
  }

  if(msg.command == 'send-id') {
    msg.data;
    db.collection('quotation-data').doc(msg.data)
      .get()
      .then(doc => {
        db.collection('load-item').doc('item').set({dataItem: doc.data().data});
      })
      .catch(err => {
        console.log(err);
      })

  }

  if(msg.command == 'id-data') {
    db.collection('load-item').doc('item').get()
    .then(doc => {
      let message = doc.data();
      resp({ type: 'result', status: 'success', data: message, request: msg });
    })
    .catch(err => {
      resp({ type: 'result', status: 'error', data: 'Data Not Found', request: msg });
    })
  }




  if (msg.command == 'fetch') {

    const quotationData = db.collection('quotation-data');
    let arr = [];

    quotationData.orderBy("data.timeNum").get()
      .then(docs => {
        docs.forEach(doc => {
          let obj = {
            quotationData: doc.data(),
            id: doc.id
          };
          arr.push(obj);
        });
        resp({ type: 'result', status: 'success', data: arr, request: msg });

      })
      .catch(err => {
        resp({ type: 'result', status: 'error', data: 'Data Not Found', request: msg });
      })
  }



  return true;

});
