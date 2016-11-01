var blessed = require('blessed');

module.exports = {

  init: function() {
    var screen = blessed.screen({
        autopadding: true,
        smartCSR: true,
        title: 'Slack'
      }),

      container = blessed.box({
        width: '100%',
        height: '100%',
        style: {
          fg: '#bbb',
          bg: '#1d1f21'
        }
      }),

      sideBar = blessed.box({
        width: '30%',
        height: '100%',
      }),

      usersBox = blessed.box({
        width: '100%',
        height: '40%',
        top: '60%',
        border: {
          type: 'line'
        },
        style: {
          border: {
            fg: '#888'
          }
        }

      }),

      usersTitle = blessed.text({
        width: '90%',
        left: '5%',
        align: 'center',
        content: '{bold}Users{/bold}',
        tags: true
      }),

      userList = blessed.list({
        width: '90%',
        height: '70%',
        left: '5%',
        top: '20%',
        keys: true,
        vi: true,
        style: {
          selected: {
            bg: '#373b41',
            fg: '#c5c8c6'
          }
        },
        tags: true
      }),

      channelsBox = blessed.box({
        width: '100%',
        height: '60%',
        border: {
          type: 'line'
        },
        style: {
          border: {
            fg: '#888'
          }
        }

      }),

      channelsTitle = blessed.text({
        width: '90%',
        left: '5%',
        align: 'center',
        content: '{bold}Channels{/bold}',
        tags: true
      }),

      channelList = blessed.list({
        width: '90%',
        height: '85%',
        left: '5%',
        top: '10%',
        keys: true,
        vi: true,
        style: {
          selected: {
            bg: '#373b41',
            fg: '#c5c8c6'
          }
        },
        tags: true
      }),

      mainWindow = blessed.box({
        width: '70%',
        height: '100%',
        left: '30%',
        //scrollable: true,
        border: {
          type: 'line'
        },
        style: {
          border: {
            fg: '#888'
          }
        }
      }),

      mainWindowTitle = blessed.text({
        width: '90%',
        tags: true
      }),

      chatWindow = blessed.box({
        width: '90%',
        height: '75%',
        left: '5%',
        top: '10%',
        keys: true,
        vi: true,
        scrollable: true,
        alwaysScroll: true,
        tags: true
      }),

      messageInput = blessed.textbox({
        width: '90%',
        left: '5%',
        top: '85%',
        keys: true,
        vi: true,
        inputOnFocus: true,
        border: {
          type: 'line'
        }
      });

    channelsBox.append(channelsTitle);
    channelsBox.append(channelList);
    usersBox.append(usersTitle);
    usersBox.append(userList);
    sideBar.append(channelsBox);
    sideBar.append(usersBox);
    mainWindow.append(mainWindowTitle);
    mainWindow.append(chatWindow);
    mainWindow.append(messageInput);
    container.append(sideBar);
    container.append(mainWindow);
    screen.append(container);

    function keyBindings(ch, key) {
      switch (key.full) {
        case 'escape': process.exit(0);
          break;
        case 'C-u': userList.focus(); // ctrl-u for users
          break;
        case 'C-c': channelList.focus(); // ctrl-c for channels
          break;
        case 'C-w': messageInput.focus(); // ctrl-w for write
          break;
        case 'C-l': chatWindow.focus(); // ctrl-l for message list
          break;
      }
      return;
    }

    // Quit on Escape or Control-C.
    userList.on('keypress', keyBindings);
    channelList.on('keypress', keyBindings);
    chatWindow.on('keypress', keyBindings);
    messageInput.on('keypress', function(ch, key){
      if (    key.full === 'escape' ||
        key.full === 'C-u'    ||
        key.full === 'C-c'    ||
        key.full === 'C-w'    ||
        key.full === 'C-l'   ) {
          messageInput.cancel();
          keyBindings(ch, key);
        }
    });

    // scrolling in chat window
    chatWindow.on('keypress', function(ch, key) {
      if (key.name === 'up') {
        chatWindow.scroll(-1);
        screen.render();
        return;
      }
      if (key.name === 'down') {
        chatWindow.scroll(1);
        screen.render();
        return;
      }
    });

    // event handlers for focus and blur of inputs
    var onFocus = function(component) {
      component.style.border = {'fg': '#cc6666'};
      screen.render();
    };
    var onBlur = function(component) {
      component.style.border = {'fg': '#888'};
      screen.render();
    };
    userList.on('focus', onFocus.bind(null, usersBox));
    userList.on('blur', onBlur.bind(null, usersBox));
    channelList.on('focus', onFocus.bind(null, channelsBox));
    channelList.on('blur', onBlur.bind(null, channelsBox));
    messageInput.on('focus', onFocus.bind(null, messageInput));
    messageInput.on('blur', onBlur.bind(null, messageInput));
    chatWindow.on('focus', onFocus.bind(null, mainWindow));
    chatWindow.on('blur', onBlur.bind(null, mainWindow));

    return {
      screen: screen,
      usersBox: usersBox,
      channelsBox: channelsBox,
      usersTitle: usersTitle,
      userList: userList,
      channelsTitle: channelsTitle,
      channelList: channelList,
      mainWindow: mainWindow,
      mainWindowTitle: mainWindowTitle,
      chatWindow: chatWindow,
      messageInput: messageInput
    };
  }

};
