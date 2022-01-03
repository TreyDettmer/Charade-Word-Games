import './App.css';
import React from 'react'
import CategoriesComponent from './CategoriesComponent'
import PromptComponent from './PromptComponent'
import GameButtonsComponent from './GameButtonsComponent';
import CategoryLoaderComponent from './CategoryLoaderComponent';
import ProgressBarComponent from './ProgressBarComponent';
import GameStatsComponent from './GameStatsComponent';
import TimerOptionsComponent from './TimerOptionsComponent';
import {Howl, Howler} from 'howler'
import HelpComponent from './HelpComponent';

/*
Author: Trey Dettmer
Last Updated: 1/2/2022

*/

Howler.volume(0.0);
class App extends React.Component {
  state = {
    gameState: "pregame",
    categories: [{name:"Easy",file:"easy_words"},
                {name:"Medium",file:"medium_words"},
                {name:"Hard",file:"hard_words"},
                {name:"Entertainment",file:"entertainment"},
                {name:"People and Characters",file:"people_characters"},
                {name:"Travel",file:"travel"},
                {name:"Household",file:"household"},
                {name:"Food",file:"food"},
                {name:"Music",file:"music"},
                {name:"Holiday Words",file:"holidays"}
    ],
    promptLists: [],
    promptListIndices: [0,0,0],
    currentCategoryIndex: 0,
    gameName: "catchphrase",
    currentPrompt: "",
    timerLength: 50.0,
    timerValue: 50.0,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    tiltValue: 90,
    lastTiltTime: 0,
    timerProgress: 0.0,
    seenPrompts: [],
    soundIsMuted: true,
    displaySettings: {
      headerStyle: "none",
      startButtonStyle: "hidden",
      gameButtonsStyle: "none",
      categoryOptionsStyle: "hidden",
      timerOptionsStyle: "hidden",
      promptStyle: "catchphrase-prompt_inactive",
      categoryLoaderStyle: "none",
      timerProgressStyle: "hidden",
      skipButtonStyle: "hidden",
      gameStatsStyle: "hidden",
      helpStyle: "hidden"
    }
  }
  hasMounted = false;
  INTIAL_COUNTDOWN_TIMER_VALUE = 5.0;
  correctSound = new Howl({
    src: ["/correct.wav"],
    html5: false
  });
  incorrectSound = new Howl({
    src: ["/incorrect.wav"],
    html5: false
  });
  gameOverSound = new Howl({
    src: ["/gameover.wav"],
    html5: false
  });

  
  constructor(props) {
    super(props);
    this.SetWindowDimensions = this.SetWindowDimensions.bind(this);
    this.StartGame = this.StartGame.bind(this);
    this.ReturnToMenu = this.ReturnToMenu.bind(this);
    this.ChangeGame = this.ChangeGame.bind(this);
    this.LoadCategory = this.LoadCategory.bind(this);
    this.GetAccelerationPermission = this.GetAccelerationPermission.bind(this);
    this.ClickedLoadCategories = this.ClickedLoadCategories.bind(this);
    this.ToggleMuteSound = this.ToggleMuteSound.bind(this);
    this.ToggleHelpScreen = this.ToggleHelpScreen.bind(this);
    this.OnChangeTimerLength = this.OnChangeTimerLength.bind(this);
  }



  SetWindowDimensions() 
  {
    this.setState(() => ({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    }),() => {});
  }
  

  OnTiltValueChanged(prevState)
  {
    if (this.state.gameName === "headsup" && this.state.gameState === "running")
    {   
      
      if (Math.abs(this.state.tiltValue) < 30 && Math.abs(this.state.tiltValue) > 10)
      {
        if (Math.abs(this.state.timerValue - this.state.lastTiltTime) >= 1.25)
        {
          if (this.state.tiltValue < 0)
          {
            try
            {
              this.incorrectSound.play();           
            }
            catch {}     
            this.GotoNextPrompt(false);
          }
          else
          {
            try
            {
              this.correctSound.play();
            }
            catch {}             
            this.GotoNextPrompt(true);
          }

          this.setState(() => ({
            lastTiltTime: this.state.timerValue
          }),() => {});

        }      
      }
    }
  }



  OnTimerValueChanged(prevState)
  {

    if (this.state.gameState === "running")
    {
      if (this.state.timerValue <= 0.0)
      {
        this.EndGame();
      }
      else
      {
        let progress = (parseFloat(this.state.timerValue) / this.state.timerLength) * 100.0;
        this.setState(() => ({
          timerProgress: progress
        }),() => {});
      }
    }
    else if (this.state.gameState === "countdown")
    {
      if (this.state.timerValue <= this.state.timerLength)
      {
        this.setState(() => ({
          gameState: "running",
          currentPrompt: this.state.promptLists[this.state.currentCategoryIndex].prompts[this.state.promptListIndices[this.state.currentCategoryIndex]],
        }),() => {});

      }
      else
      {
        this.setState(() => ({
          currentPrompt: (this.state.timerValue - this.state.timerLength).toFixed(0),
        }),() => {});
      }
    }
  }

  OnGameStateChanged(prevState)
  {
    let interval = null;
    if (prevState.gameState === "pregame")
    {
      
      if (this.state.gameState === "running" || this.state.gameState === "countdown")
      {
        // clock is speeding up every round
        interval = setInterval(() => {
          if (this.state.timerValue > 0.0)
          {

            this.setState(() => ({
              timerValue: this.state.timerValue - 0.1
            }),() => {});
            

          }
          else
          {
            clearInterval(interval);
          }
        },100);
      }
      else
      {
        clearInterval(interval);
      }
    }


  }

  OnPromptIndexChanged(prevState)
  {
    this.setState(() => ({
      
      currentPrompt: this.state.promptLists[this.state.currentCategoryIndex].prompts[this.state.promptListIndices[this.state.currentCategoryIndex]],
    }),() => {});
  }

  AdjustDisplay(prevState)
  {
    if (this.state.gameState === "running" || this.state.gameState === "countdown")
    {
      if (this.state.gameName === "catchphrase")
      {
        this.setState(() => ({
          displaySettings: {
            ...this.state.displaySettings,
            headerStyle: "none",
            startButtonStyle: "hidden",
            gameButtonsStyle: "hidden",
            promptStyle: "catchphrase-prompt_active",
            timerProgressStyle: "none",
            skipButtonStyle: "none",
            categoryOptionsStyle: "hidden",
            timerOptionsStyle: "hidden",
            categoryLoaderStyle: "hidden",
            gameStatsStyle: "hidden"
          }
        }),() => {});

      }
      else
      {
        this.setState(() => ({
          displaySettings: {
            ...this.state.displaySettings,
            headerStyle: "hidden",
            startButtonStyle: "hidden",
            gameButtonsStyle: "hidden",
            promptStyle: "headsup-prompt_active",
            timerProgressStyle: "none",
            categoryOptionsStyle: "hidden",
            timerOptionsStyle: "hidden",
            categoryLoaderStyle: "hidden",
            gameStatsStyle: "hidden"
          }
        }),() => {});
      }
      
    }
    else if (this.state.gameState === "pregame")
    {
      if (this.state.gameName === "catchphrase")
      {
        this.setState(() => ({
          displaySettings: {
            ...this.state.displaySettings,
            headerStyle: "none",
            gameButtonsStyle: "none",
            startButtonStyle: this.state.promptLists.length > 0 ? "none" : "hidden",
            promptStyle: "catchphrase-prompt_inactive",
            timerProgressStyle: "hidden",
            skipButtonStyle: "hidden",
            categoryOptionsStyle: this.state.promptLists.length > 0 ? "none" : "hidden",
            timerOptionsStyle: this.state.promptLists.length > 0 ? "none" : "hidden",
            categoryLoaderStyle: this.state.displaySettings.categoryLoaderStyle !== "hidden" ? "none" : "hidden",
            gameStatsStyle: "hidden"
          }
        }),() => {});
      }
      else
      {
        this.setState(() => ({
          displaySettings: {
            ...this.state.displaySettings,
            headerStyle: "none",
            gameButtonsStyle: "none",
            startButtonStyle: this.state.promptLists.length > 0 ? "none" : "hidden",
            promptStyle: "headsup-prompt_inactive",
            timerProgressStyle: "hidden",
            skipButtonStyle: "hidden",
            categoryOptionsStyle: this.state.promptLists.length > 0 ? "none" : "hidden",
            timerOptionsStyle: this.state.promptLists.length > 0 ? "none" : "hidden",
            categoryLoaderStyle: this.state.displaySettings.categoryLoaderStyle !== "hidden" ? "none" : "hidden",
            gameStatsStyle: "hidden"
          }
        }),() => {});
      }
      
    }
    else
    {
      if (this.state.gameName === "catchphrase")
      {
        this.setState(() => ({
          displaySettings: {
            ...this.state.displaySettings,
            headerStyle: "hidden",
            gameButtonsStyle: "hidden",
            startButtonStyle: "hidden",
            promptStyle: "hidden",
            timerProgressStyle: "hidden",
            skipButtonStyle: "hidden",
            categoryOptionsStyle: "hidden",
            timerOptionsStyle: "hidden",
            categoryLoaderStyle: "hidden",
            gameStatsStyle: "none"
          }
        }),() => {});
      }
      else
      {

        this.setState(() => ({
          displaySettings: {
            ...this.state.displaySettings,
            headerStyle: "hidden",
            gameButtonsStyle: "hidden",
            startButtonStyle: "hidden",
            promptStyle: "hidden",
            timerProgressStyle: "hidden",
            skipButtonStyle: "hidden",
            categoryOptionsStyle: "hidden",
            timerOptionsStyle: "hidden",
            categoryLoaderStyle: "hidden",
            gameStatsStyle: "none"
          }
        }),() => {});
      }
    }
  }

  async LoadCategory(index = 0)
  {
    if (index >= this.state.categories.length)
    {
      // we have finished loading all of the categories
      this.ShufflePromptList(0);
      return;
    }
    else
    {
      let category = this.state.categories[index];
      let file = category.file;
      let prompts = await this.LoadPromptListFromFile(file);

      this.setState(() => ({
        promptLists: [...this.state.promptLists,{name: category.name, prompts: prompts}]
      }), async () => {
        await this.LoadCategory(index+1);
      });
    }
  }

  async LoadPromptListFromFile(file)
  {
    return fetch("./prompt_files/" + file + ".txt")
    .then((r) => r.text().then(text => 
      {
        var words = text.split("\n");
        words.forEach((o,i,a) => a[i] = a[i].replace("\r",""));
        words = words.filter(word => word !== "" && typeof word !== "undefined");
        return words;
      })
    )
    .catch(() => console.log("Failed to find file: ./prompt_files/" + file + ".txt"))
  }

  StartGame()
  {
    if (this.state.gameName === "headsup")
    {
      this.setState(() => ({
        gameState: "countdown",
        currentPrompt: this.INTIAL_COUNTDOWN_TIMER_VALUE,
        timerValue: this.state.timerLength + this.INTIAL_COUNTDOWN_TIMER_VALUE
      }));
      
    }
    else
    {
      this.setState(() => ({
        gameState: "running",
        currentPrompt: this.state.promptLists[this.state.currentCategoryIndex].prompts[this.state.promptListIndices[this.state.currentCategoryIndex]],
        timerValue: this.state.timerLength
      }));

    }
  }

  // Fisher-Yates shuffling algorithm
  ShuffleArray(array)
  {
    let mutArray = [...array]
    for (let i = mutArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = mutArray[i];
      
      mutArray[i] = mutArray[j];
      mutArray[j] = temp;
    }
    return [...new Set(mutArray)];
  }

  ShufflePromptList(index = 0)
  {
    if (index >= this.state.categories.length)
    {
      if (this.state.categories.find(category => category.name === "Everything"))
      {
        let shuffledEverythingPromptList = this.ShuffleArray(this.state.promptLists[this.state.categories.length - 1].prompts);
        this.setState(() => ({
          promptLists: this.state.promptLists.map((item,i) => {
                          if (i ===  this.state.categories.length - 1)
                          {
                            return {name: "Everything", prompts: shuffledEverythingPromptList}
                          }
                          else
                          {
                            return item;
                          }
                        }),
          displaySettings: {
            ...this.state.displaySettings,
            startButtonStyle: "none",
            categoryOptionsStyle: "none",
            timerOptionsStyle: "none",
          }
        }),() => {
          // set currentPrompt     
          this.setState(() => ({
            currentPrompt: this.state.promptLists[this.state.currentCategoryIndex].prompts[this.state.promptListIndices[this.state.currentCategoryIndex]],
          }),() => {});
        });    
      }
      else
      {
        let initialPromptIndices = []
        for (let i = 0; i <= this.state.categories.length; i++)
        {
          initialPromptIndices[i] = 0;
        }
        this.setState(() => ({
          promptListIndices: initialPromptIndices
        }),() => {});

        let everythingPrompts = [];
      
        this.state.promptLists.forEach(category => {
         
          everythingPrompts = [...everythingPrompts,...category.prompts];

        });
        everythingPrompts = this.ShuffleArray(everythingPrompts);
        this.setState(() => ({
          categories: [...this.state.categories,{name:"Everything",file:""}],
          promptLists: [...this.state.promptLists, {name: "Everything", prompts: everythingPrompts}],
          displaySettings: {
            ...this.state.displaySettings,
            startButtonStyle: "none",
            categoryOptionsStyle: "none",
            timerOptionsStyle: "none"
          }
        }),() => {
          // we've finished shuffling all of the categories
          // set currentPrompt     
          this.setState(() => ({
            currentPrompt: this.state.promptLists[this.state.currentCategoryIndex].prompts[this.state.promptListIndices[this.state.currentCategoryIndex]]
          }),() => {});
        });
      }
      this.setState((prevState) => ({
        displaySettings: {
          ...prevState.displaySettings,
          categoryLoaderStyle: "hidden",
        }
      }),() => {});

    }
    else
    {
      let shuffledPromptList = this.ShuffleArray(this.state.promptLists[index].prompts);



      this.setState(() => ({
        promptLists: this.state.promptLists.map((item,i) => {
                        if (i === index )
                        {
                          return {name: this.state.promptLists[index].name, prompts: shuffledPromptList}
                        }
                        else
                        {
                          return item;
                        }
                      })
      }),() => {
        this.ShufflePromptList(index+1);
      });
      

    }
  }




  ReturnToMenu()
  {
    this.setState(() => ({
      seenPrompts: [],
      timerValue: this.state.timerLength,
      gameState: "pregame"
    }),() => {});

  }
  GetAccelerationPermission()
  {
    try 
    {
      DeviceMotionEvent.requestPermission().then(response => {
        if (response === 'granted')
        {
          let lastUpdateTime = 0;
          let currentTime = 1;
          window.addEventListener('deviceorientation',(event) => {

            if (currentTime - lastUpdateTime >= 5)
            {
              lastUpdateTime = currentTime;
              this.setState(() => ({
                tiltValue: Math.round(event.gamma * 10) / 10
              }),() => {});
            }
            currentTime++;
            
          })
          
          this.setState(() => ({
            gameName: "headsup"
          }),() => {});
          return true;    
        }
        else
        {
          
          return false;
        }
      })
      return true;  
    }
    catch 
    {
      alert("You can only play headsup on a mobile device with accelerometer permissions enabled.");
      return false;  
    }
    
  }

  ChangeGame(_gameName)
  {
    if (this.state.gameState !== "running")
    {
      if (_gameName === "headsup")
      {
        this.GetAccelerationPermission();
      }
      else if (_gameName === "catchphrase")
      {
        this.setState(() => ({
          gameName: _gameName
        }),() => {});
      }
    }
  }

  GotoNextPrompt(correctlyGuessed)
  {
    if (this.state.gameState === "running")
    {
      this.UpdateSeenPrompts(correctlyGuessed);
      this.IncrementPromptIndex();
    }   
  }

  UpdateSeenPrompts(correctlyGuessed)
  {
    if (this.state.currentPrompt !== "" && typeof this.state.currentPrompt !== 'undefined')
    {
      if (correctlyGuessed === true)
      {
        this.setState(() => ({
          seenPrompts: [...this.state.seenPrompts,this.state.currentPrompt],
        }),() => {});

      }
      else
      {
        this.setState(() => ({
          seenPrompts: [...this.state.seenPrompts,"?" + this.state.currentPrompt],
        }),() => {});
      }

    }
  }

  IncrementPromptIndex()
  {
    let length = this.state.promptLists[this.state.currentCategoryIndex].prompts.length;
    this.setState(() => ({
      promptListIndices: this.state.promptListIndices.map((item,i) => {
        if (i ===  this.state.currentCategoryIndex)
        {
          return ((item + 1) % length + length) % length
        }
        else
        {
          return item;
        }
      }),

    }),() => {});
  }

  EndGame()
  {
    this.UpdateSeenPrompts(false);
    this.IncrementPromptIndex();
    if (this.state.gameName === "headsup")
    {
      try
      {
        this.gameOverSound.play();
      }
      catch{}  
    }
    this.setState(() => ({
      gameState: "postgame"
    }),() => {});
  }

  OnChangeTimerLength(event)
  {
    if (this.state.gameState !== "running" && this.state.gameState !== "countdown")
    {

      let newTimerLength = parseFloat(event.target.value);
      this.setState(() => ({
        timerLength: newTimerLength,
        timerValue: newTimerLength
      }),() => {});
    }
  }

  OnChangeCategory(event)
  {
    if (this.state.gameState !== "running")
    {
      let newCategory = (category) => category.name === event.target.value;
      let newCategoryIndex = this.state.categories.findIndex(newCategory);
      this.setState(() => ({
        currentCategoryIndex: newCategoryIndex
      }),() => {});
    }
  }

  ToggleMuteSound()
  {
    this.setState((prevState) => ({
      soundIsMuted: !prevState.soundIsMuted
    }),() => {
      if (this.state.soundIsMuted)
      {
        Howler.volume(0.0);
      }
      else
      {
        Howler.volume(0.5);
      }
    });
    
  }

  ClickedLoadCategories()
  {

    this.setState((prevState) => ({
      displaySettings : {
        ...prevState.displaySettings,
        categoryLoaderStyle: "loading"
      }
    }),() => {
      this.LoadCategory(0);
    })
  }

  ToggleHelpScreen()
  {
    if (this.state.displaySettings.helpStyle === "hidden")
    {
      this.setState((prevState) => ({
        displaySettings : {
          ...prevState.displaySettings,
          helpStyle: "none"
        }
      }),() => {})
    }
    else
    {
      this.setState((prevState) => ({
        displaySettings : {
          ...prevState.displaySettings,
          helpStyle: "hidden"
        }
      }),() => {})
    }
  }

  componentDidMount()
  {
    this.setState((prevState) => ({
      timerValue: this.state.timerLength
    }),() => {})
    window.addEventListener('resize', this.SetWindowDimensions);
  }

  componentDidUpdate(prevProps, prevState)
  {
    if (prevState.tiltValue !== this.state.tiltValue)
    {
      this.OnTiltValueChanged(prevState);
    }
    if (prevState.timerValue !== this.state.timerValue)
    {
      this.OnTimerValueChanged(prevState);
    }
    if (prevState.gameState !== this.state.gameState)
    {
      this.AdjustDisplay(prevState);
      this.OnGameStateChanged(prevState);
    }
    if (prevState.promptListIndices !== this.state.promptListIndices)
    {
      this.OnPromptIndexChanged(prevState);
    }

    if (prevState.windowWidth !== this.state.windowWidth || 
        prevState.windowHeight !== this.state.windowHeight ||
        prevState.gameName !== this.state.gameName)
    {
      this.AdjustDisplay(prevState);
    }

    if (prevState.promptsEverything !== this.state.promptsEverything)
    {
      this.OnPromptsEverythingChanged(prevState);
    }
  }

  render(){ 
    return (
    <>

    <div id="header" className={this.state.displaySettings.headerStyle}>
      <h1>Charade Word Games</h1>
      <h2>Made By Trey Dettmer</h2>
      <img alt='mute button' onClick={this.ToggleMuteSound} src={this.state.soundIsMuted ? './mutedIcon.png' : './unmutedIcon.png'}   id="muteButton"></img>
      <img alt='help button' onClick={this.ToggleHelpScreen} src="./helpIcon.png"   id="helpButton"></img>
    </div>
    
    <div>
      <HelpComponent
        displaySettings={this.state.displaySettings}
      />
      <GameButtonsComponent 
        displaySettings={this.state.displaySettings} 
        ChangeGame={this.ChangeGame} 
        gameName={this.state.gameName}
      />
      <CategoryLoaderComponent
        displaySettings={this.state.displaySettings}
        LoadCategories={this.ClickedLoadCategories}      
      />
      <TimerOptionsComponent
        displaySettings={this.state.displaySettings}
        currentTimerLength={this.state.timerLength}
        OnChangeTimerLength={this.OnChangeTimerLength}
      />
      <CategoriesComponent 
        displaySettings={this.state.displaySettings}
        categories={this.state.categories} 
        currentCategory={this.state.currentCategory} 
        onChangeCategory={e => this.OnChangeCategory(e)}
        className={this.state.promptLists.length < 1 ? "hidden" : "none"}
      />
      <button className={this.state.displaySettings.startButtonStyle} id="startButton" onClick={this.StartGame}>Start</button>
      <ProgressBarComponent
        displaySettings={this.state.displaySettings}
        progress={this.state.timerProgress}
      />
      <PromptComponent 
        displaySettings={this.state.displaySettings}
        prompt={this.state.currentPrompt} 
        gameState={this.state.gameState} 
        timerValue={this.state.timerValue} 
        gameName={this.state.gameName}
      />
      <button id="skipButton" className={this.state.displaySettings.skipButtonStyle} onClick={() => this.GotoNextPrompt(true)}>Next/Skip</button>
      <GameStatsComponent 
        displaySettings={this.state.displaySettings}
        stats={this.state.seenPrompts} 
        ReturnToMenu={this.ReturnToMenu}
      />
    </div>
    </>
    )
  }
}

export default App;