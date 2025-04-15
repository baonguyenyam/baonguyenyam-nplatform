# Show menu to select the app to run

echo "\033[1;32mSelect the app to run\033[0m"
select app in "Run DEV" "DB Reset" "DB Migrate" "DB Seed" "Format" "Build" "Update NPM" "Docs" "Beta NPM" "Kill Port 3000" "Exit"
do
  case $app in
	"Run DEV")
	echo "\033[1;32mRunning DEV app\033[0m"
	  sh cmd/dev.sh
	  break
	  ;;
	"DB Reset")
	echo "\033[1;32mRunning SETUP app\033[0m"
	  sh cmd/reset.sh
	  ;;
	"Format")
	echo "\033[1;32mRunning FORMAT app\033[0m"
	  sh cmd/format.sh
	  ;;
	"DB Migrate")
	echo "\033[1;32mRunning DB Migrate\033[0m"
	  sh cmd/prisma-migrate.sh
	  ;;
	"DB Seed")
	echo "\033[1;32mRunning DB Seed\033[0m"
	  sh cmd/prisma-seed.sh
	  ;;
	"Beta NPM")
	echo "\033[1;32mRunning BETA NPM app\033[0m"
	  sh cmd/beta.sh
	  ;;
	"Docs")
	echo "\033[1;32mRunning DOCS app\033[0m"
	  sh cmd/docs.sh
	  ;;
	"Exit")
	  echo "Exiting..."
	  sh app.sh
	  break
	  ;;
	"Build")
	echo "\033[1;32mRunning BUILD app\033[0m"
	  sh cmd/build.sh
	  ;;
	"Update NPM")
	echo "\033[1;32mRunning UPDATE NPM app\033[0m"
	  npx npm-check-updates -u && yarn 
	  ;;
	"Kill Port 3000")
	echo "\033[1;32mRunning KILL PORT 3000 app\033[0m"
	  sh cmd/kill.sh
	  ;;
	*)
	  # Return to the main menu
	  echo "Invalid option $REPLY"
	  sh app.sh
	  break
	;;

  esac
done