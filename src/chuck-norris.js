import { Skill, Launch, Intent } from 'alexa-annotations';
import Response from 'alexa-response';
import ssml from 'alexa-ssml-jsx';
import fetch from 'isomorphic-fetch';

const API_ENDPOINT = 'http://api.icndb.com/jokes/random?escape=javascript';

@Skill
export default class ChuckNorris {

  @Launch
  @Intent('AMAZON.YesIntent', 'joke')
  joke() {
    return this.getJoke().then(joke => Response.build({
      ask: (
        <speak>
          <s>{joke}</s>
          <break time='1s' />
          <s>Would you like to hear another?</s>
        </speak>
      ),
      reprompt: 'Would you like to hear another?',
      card: {
        title: 'Chuck Norris',
        content: joke
      }
    }));
  }

  @Intent('AMAZON.HelpIntent')
  help() {
    return Response.build({
      ask: 'I tell jokes about Chuck Norris. Would you like to hear one?',
      reprompt: 'Would you like to hear a Chuck Norris joke?'
    });
  }

  getJoke() {
    return fetch(API_ENDPOINT).then(_ => _.json()).then(response => {
      const { type, value } = response;
      return type === 'success' ? value.joke : Promise.reject();
    });
  }
}
