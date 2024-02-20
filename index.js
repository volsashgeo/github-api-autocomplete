const textField = document.querySelector('#text-field');
const autocomplete = document.querySelector('.autocomplete');
const infoPinned = document.querySelector('.info-pinned');

function debounce (fn, debounceTime) {
    let timeout;

    return function (...args) {
      const fnCall = () => {
        fn.apply(this, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(fnCall, debounceTime);
    };
  };

textField.addEventListener('keyup', debounce(() => {
    autocomplete.textContent = '';
    searchRepositories();
}, 400));

async function searchRepositories() {

    if(!(textField.value.trim() === '')) {
        return await fetch(`https://api.github.com/search/repositories?q=${textField.value}`)
        .then(res => {
            if(res.ok) {
                res.json().then(repositories => {
                    repositories.items.forEach((repo,index) => {
                        if(index < 5) {
                            showRepo(repo);
                        }
                    })
                })
            }else {
                throw new Error('Введите запрос или подождите 1 минуту');
            }
        })
        .catch(err => console.log(err));
    }

}

function showRepo(repository) {
    const repo = document.createElement('li')
    repo.className = 'repository';

    repo.textContent = repository.name

    let obj = {
        name: repository.name,
        owner: repository.owner.login,
        stars: repository.stargazers_count
        }

    repo.dataset.info = JSON.stringify(obj)

    autocomplete.append(repo)
}

autocomplete.addEventListener("click", (e) => {

  e.target.classList.add("clicked");

  let repositoryOptions = JSON.parse(e.target.dataset.info);

  let pinRepo = document.createElement("li");

  let repoName = document.createElement("div");
  repoName.textContent = `Name: ${repositoryOptions.name}`;

  let repoOwner = document.createElement("div");
  repoOwner.textContent = `Owner: ${repositoryOptions.owner}`;

  let repoStars = document.createElement("div");
  repoStars.textContent = `Stars: ${repositoryOptions.stars}`;

  let repoSvg = document.createElement("div");
  repoSvg.className = "close-button opened";

  pinRepo.append(repoName);
  pinRepo.append(repoOwner);
  pinRepo.append(repoStars);
  pinRepo.append(repoSvg);

  infoPinned.append(pinRepo);

  textField.value = "";
});


infoPinned.addEventListener('click', e => {

    if (e.target.classList.contains('close-button')) {

        e.target.closest('li').remove();
    }
})




