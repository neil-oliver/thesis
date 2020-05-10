# Is Twitter Feeding Bitcoin? 
[VIEW PROJECT](http://neiloliver.co/influence)
## An analysis of Twitter content, user behavior, and correlation to Bitcoin market value.
  
### Table of Contents
- [Abstract](#abstract)
- [Screen Captures](#screen-captures)
- [Future Development](#future-developments--support-request)
- [Acknowledgements](#acknowledgements)
- [Planning and Development](./planning) (separate page)
- [Technical Documentation](./development) (separate page)

## Abstract
Bitcoin’s volatile price fluctuations can be linked to its perceived future value, potential use cases & concerns over longevity and legislation. Public discussions on social media can serve as a platform to gain information on Bitcoin from a wide audience, from amateurs to professionals, therefore influencing public opinion and Bitcoin trading activity. 
  
This project dissects the user behavior and content of Twitter to investigate which elements have the strongest correlation to changes in Bitcoin market value. Evaluating a body of 100,000 tweets over a period of one week, volume data of both tweet generation and user interactions is combined with sentiment analysis to create a series of interactive exploratory visualizations. 
  
The visualizations present comparisons of different methods of user interactions, including retweets, likes and comments and allows filtering to remove data that may be deemed uninfluential before aggregated sentiment analysis takes place. During sentiment analysis, weighted models allow for the balance to be shifted to give preference to the opinions of users with a high follower count, or messages with a high level of interaction. As a final stage, time delay between online discussions and Bitcoin trading activity is explored and accounted. 
  
Rather than provide definitive answers, the project invites the user to explore the vast array of filtering, weighting and offset models to form their own conclusions and observations.  
  
## Screen Captures
![](./preview.png)
![](./1.png)
![](./2.png)
![](./3.png)
![](./4.png)
![](./5.png)

## Future Developments / Support Request
This project provides a useful insight into the affects of different weighted models and filterings on correlation strength to Bitcoin value. 
  
It currently uses data scraped from the standard (free) Twitter API stream, which is limited both in scope of Tweets and the information provided for each tweet (such as missing comment data).

To expand the project further, access to additional Twitter data is needed. Any assistance in gaining access to this information could exand the project beyong the current 5 day limit (potentially viewing affects over a period of a year) and provide more accurate outcomes.

Please [contact me](mailto:neiloliverphoto@gmail.com) if you can be of any assitance and would like to collaborate on this project. 

## Acknowledgements
This project was completed as part of the 2020 Masters in Data Visualization program at Parsons School of Design, NYC. You can view all of the incredible thesis projects [HERE](https://parsons.nyc/thesis-2020/).  

This project would not be possible without the guidance and feedback of the Parsons MSDV faculty, specifically [Daniel Sauter](https://github.com/danielsauter), [Aaron Hill](https://github.com/aaronxhill) & [Karla Polo-Garcia](https://github.com/KayPolo).
  
The design direction and visual language was developed in conjunction with [Marisa Asari](https://github.com/marisaruizasari). I encourage you to check out her [amazing thesis project](https://weaponsofmassinjustice.netlify.app).

