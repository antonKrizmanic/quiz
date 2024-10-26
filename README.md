<h1 align="center">  
  Red Cross quiz
</h1>

<div align="center">
  <p>Red Cross quiz web app based on the <a href="https://github.com/Enterwell/react-starter">Enterwell</a> templated for React and Next.js</p>
  <p>Enterwell's template for web apps based on the React and Next.js.</p>
<div>

  ![GitHub last commit](https://img.shields.io/github/last-commit/antonKrizmanic/quiz?label=Last%20commit)
  [![GitHub issues](https://img.shields.io/github/issues/antonKrizmanic/quiz?color=0088ff)](https://github.com/antonKrizmanic/quiz/issues)
  [![GitHub contributors](https://img.shields.io/github/contributors/antonKrizmanic/quiz)](https://github.com/antonKrizmanic/quiz/graphs/contributors)
  [![GitHub pull requests](https://img.shields.io/github/issues-pr/antonKrizmanic/quiz?color=0088ff)](https://github.com/antonKrizmanic/quiz/pulls)

  </div>
  <div>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="typescript" width="30" />
    </a>
    <a href="https://reactjs.org/" target="_blank">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg" alt="react" width="30" />
    </a>
    <a href="https://nextjs.org/" target="_blank">
      <img src="https://user-images.githubusercontent.com/643171/203530354-f898ddfc-864f-460e-9780-4f3717256130.png" alt="nextjs" width="30" />
    </a>
    <a href="https://mobx.js.org/README.html" target="_blank">
      <img src="https://mobx.js.org/assets/mobx.png" alt="mobx" width="30" />
    </a>
    <a href="https://mui.com/" target="_blank">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" alt="mui" width="30" />
    </a>
    <a href="https://sass-lang.com/" target="_blank">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" alt="sass" width="30" />
    </a>        
  </div>
</div>

## Introduction

This is repository for Red Cross quiz web app/game, for now used by Red Cross Buje. This is only FE  client for existing API. Getting quiz categories, quizes, questions and result validation is done using backend api implemented elsewhere
As mentioned earlier this repository is created using <a href="https://github.com/Enterwell/react-starter/blob/main/.github/workflows/codeql-analysis.yml">template</a> from Enterwell. There you can find more information about architecure of this repository.

## Table of contents

* [Quick start](#quick-start)
* [Launching the application](#launching-the-application)
* [Predeployment TODOs](#predeployment-todos)

## Quick start

This project uses [pnpm](https://pnpm.io/) as its package manager so in order to get quickly up and running you will need to have it installed on your machine.

If you don't already have it, you can easily install it by using the following command (assuming you have [Node.js](https://nodejs.org/en/) installed)

```bash
npm install --global pnpm
```

Now you can setup the application without any hassle using the following command

```bash
pnpm create next-app -e https://github.com/Enterwell/react-starter
```

Create a new local configuration `.env.local` by using the provided example file using the command

```bash
cp .env.local.example .env.local
```

And success, you are ready to rumble!

Once in the project directory, you can start the `development` version of the application using the command

```bash
pnpm dev
```

## Launching the application

There are several commands with which you can launch the application and it all depends on whether you want it to run in `development` or `production` mode.

Starting the application in `development` mode is done with the command

```bash
pnpm dev
```

When application development is complete, the application needs to be `built`. `Building` the application is done using the command

```bash
pnpm build
```

When you have successfully `built` your application, you can start the `production` version using the command

```bash
pnpm start
```

Whether running in `development` or `production` mode, application is available at [http://localhost:3000](http://localhost:3000).

</br>

Exporting your application to static HTML, which can then be run standalone without the need of a `Node.js` server is done using the command

```bash
pnpm export
```

This command generates an `out` directory in the project root. Only use this command if you don't need any of the [features](https://nextjs.org/docs/advanced-features/static-html-export#unsupported-features) requiring a `Node.js` server.

## Predeployment TODOs

Before deploying the application, make sure that all the tasks from the list below have been completed.

* Check image optimization in `next.config.js`
* Change application's name in the `package.json`
* Change application's metadata in the `app/layout.jsx` and several pages where the specific page titles are given
* Remove all unused and starter's specific files (e.g. `PokemonsMapper.js`, `PokemonsRepository.js`...)
* Remove all `TODO_delete_this_later` files and empty folders
* Customize error pages
* Make sure that the correct API URL is available to the application through the `NEXT_PUBLIC_API_URL` environmental variable (`https://localhost:5001/v1/` is the default)
