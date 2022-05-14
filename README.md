# おなまえ「あいうえお」(Vue & Firebase)

## はじめに

「おなまえ『あいうえお』」は幼児向けの「ひらがな」学習用アプリです。

![クイズ画面](./quiz-img.png)

表示されるイラストの名前を五十音表から入力する「くいずモード」と、
好きにひらがなを入力して入力された名前のイラストを表示する「じゆうモード」で、
遊びながら、ひらがなを学習できます。

[おなまえ「あいうえお」](https://a-i-u-e-o.web.app/)

名前とパスワードを設定してログインすると、自分でオリジナルのクイズを登録できます。  
お子さんの好きなものや親しみのある画像をクイズとして登録することで、学習効果もアップするかもしれません。


## 使用技術
・Vue  
・VueCLI  
・VueRouter  
・Vuex  
・JavaScript  
・CSS  
・Firebase  
  -Firestore  
  -Storage  
  -Hosting


## 機能一覧
### くいずモード  
「くいずモード」では、表示されるイラストの名前を五十音表形式の入力パットで入力して答えます。間違った文字を入力すると、注意されるので、正しく入力して、正解していきましょう。
#### ・ひんと機能
「ひんと」ボタンを押すと、解答中のクイズの次の一文字が表示されるので、同じ文字を探して入力してみましょう。わからなくなって投げ出すことなくクイズに挑戦できます。  
![ヒント画面](./hint-img.png)  

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
