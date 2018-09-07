import React from 'react';
import { patchProfileURL, unesc } from './utils.js'

function Tweets(props) {

  if (props.selected) {
    return (
      <div id="expand_container" className="detail_container_on">
        {props.tweets.map((item, i) => {
          const imageUrl = patchProfileURL(item.profile_image_url)
          const url = `https://twitter.com/${item.user_id}/status/${item.tweet_id}`
          const text = unesc(item.text)
          return (
            <div key={`tw_${i}`}>
              <a href={url} target='_blank'>
                <div className="tweet_detail">
                  <div className='avatar_container'>
                    <img className="avatar" src={imageUrl} alt={item.screen_name}/>
                  </div>
                  <div>
                    <span className="tweet_user">{item.screen_name}</span>: {text}
                  </div>
                </div>
              </a>
            </div>
          )
        })}
      </div>
    )
  } else {
    return (<div className="detail_container_off"></div>)
  }
}


export default Tweets;