const mainButton = document.createElement('button');
mainButton.setAttribute('class', 'js-trigger-unfollowers btn-super-duper');
mainButton.textContent = 'Get Unfollowers';
document.body.append(mainButton);
attachEvents(mainButton);

function attachEvents(mainButton) {
  mainButton.addEventListener('click', (event) => {
    event.preventDefault();
    let scrollSizeTest = 0;
    let followers = [];
    let following = [];

    const followersButton = document.querySelector('[href*="followers"]');
    const followingButton = document.querySelector('[href*="following"]');
    const followersCount = parseInt(followersButton.querySelector('span').textContent, 10);
    const followingCount = parseInt(followingButton.querySelector('span').textContent, 10);

    console.log(followersCount, ' followers total count');

    function countFollowers(followersUlInner) {
      followers = Array.from(followersUlInner.children).map((x) => {
        const anchorTag = x.querySelector('span a');
        const imgSrc = x.querySelector('img').src;

        return {
          name: anchorTag.title,
          url: anchorTag.href,
          profilePicture: imgSrc,
        };
      });

      getFollowing();
    }

    function countFollowing(followersUlInner) {
      following = Array.from(followersUlInner.children).map((x) => {
        const anchorTag = x.querySelector('span a');
        const imgSrc = x.querySelector('img').src;

        return {
          name: anchorTag.title,
          url: anchorTag.href,
          profilePicture: imgSrc,
        };
      });

      getThemUnfollowers(followers, following);
    }

    function getThemUnfollowers() {
      const unfollowersList = [];

      following.forEach((x) => {
        const isFound = followers.find((y) => y.name === x.name);

        if (!isFound) {
          const { name, url, profilePicture } = x;

          unfollowersList.push({
            name,
            url,
            profilePicture,
          });
        }
      });

      renderUnfollowersModal(unfollowersList);
    }

    function renderUnfollowersModal(unfollowersList) {
      const modalElement = document.createElement('div');
      modalElement.classList.add('modal-unfollowers');
      let unfollowersHTML = '';
      unfollowersList.forEach((unfollower) => {
        const { name, url, profilePicture } = unfollower;
        unfollowersHTML += `<div class="modal-unfollowers__item"><img src="${profilePicture}" /> <a target="_blank" href="${url}">${name}</a></div>`;
      });

      modalElement.innerHTML = `<div class="modal-unfollowers__close">
      <button class="js-close-modal-unfollowers" onClick="(function(){
        document.querySelector('.modal-unfollowers').classList.add('hide-modal')
        return false;
    })();return false;">Close</button></div> ${unfollowersHTML}`;

      document.body.append(modalElement);
    }

    function getFollowing() {
      followingButton.click();

      setTimeout(() => {
        const followingContainer = document.querySelector('[aria-label="Following"]');
        const followingUl = followingContainer.querySelector('ul');
        const followingScroller = followingUl.parentNode;
        const followingUlInner = followingUl.children[0];

        recursem(followingScroller, followingUlInner, followingCount, countFollowing);
      }, 2000);
    }

    function recursem(followersScroller, followersUlInner, followersCount, callbackFn) {
      setTimeout(() => {
        scrollSizeTest += 600;

        const childrenCount = followersUlInner.children.length;

        followersScroller.scrollTop = scrollSizeTest;

        console.log(childrenCount, ' current count');

        if (childrenCount < followersCount) {
          recursem(followersScroller, followersUlInner, followersCount, callbackFn);
        } else {
          callbackFn(followersUlInner);
        }
      }, 500);
    }

    followersButton.click();

    setTimeout(() => {
      const followersContainer = document.querySelector('[aria-label="Followers"]');
      const followersUl = followersContainer.querySelector('ul');
      const followersScroller = followersUl.parentNode;
      const followersUlInner = followersUl.children[0];

      recursem(followersScroller, followersUlInner, followersCount, countFollowers);
    }, 2000);
  });
}
