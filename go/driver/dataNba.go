package driver

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type DataNbaEspn struct{}

var dataNbaEspnCodeName = make(map[string]([]string))

func init() {
	dataNbaEspnCodeName["ATL"] = []string{"ATL"}
	dataNbaEspnCodeName["BOS"] = []string{"BOS"}
	dataNbaEspnCodeName["BKN"] = []string{"BKN"}
	dataNbaEspnCodeName["CHA"] = []string{"CHA"}
	dataNbaEspnCodeName["CHI"] = []string{"CHI"}
	dataNbaEspnCodeName["CLE"] = []string{"CLE"}
	dataNbaEspnCodeName["DAL"] = []string{"DAL"}
	dataNbaEspnCodeName["DEN"] = []string{"DEN"}
	dataNbaEspnCodeName["DET"] = []string{"DET"}
	dataNbaEspnCodeName["GSW"] = []string{"GSW", "GS"}
	dataNbaEspnCodeName["HOD"] = []string{"HOD"}
	dataNbaEspnCodeName["IND"] = []string{"IND"}
	dataNbaEspnCodeName["LAC"] = []string{"LAC"}
	dataNbaEspnCodeName["LAL"] = []string{"LAL"}
	dataNbaEspnCodeName["MEM"] = []string{"MEM"}
	dataNbaEspnCodeName["MIA"] = []string{"MIA"}
	dataNbaEspnCodeName["MIL"] = []string{"MIL"}
	dataNbaEspnCodeName["MIN"] = []string{"MIN"}
	dataNbaEspnCodeName["NOP"] = []string{"NOP", "NO"}
	dataNbaEspnCodeName["NYK"] = []string{"NYK", "NY"}
	dataNbaEspnCodeName["OKC"] = []string{"OKC"}
	dataNbaEspnCodeName["ORL"] = []string{"ORL"}
	dataNbaEspnCodeName["PHI"] = []string{"PHI"}
	dataNbaEspnCodeName["PHX"] = []string{"PHX"}
	dataNbaEspnCodeName["POR"] = []string{"POR"}
	dataNbaEspnCodeName["SAC"] = []string{"SAC"}
	dataNbaEspnCodeName["SAS"] = []string{"SAS", "SA"}
	dataNbaEspnCodeName["TOR"] = []string{"TOR"}
	dataNbaEspnCodeName["UTA"] = []string{"UTA", "UTAH"}
	dataNbaEspnCodeName["WAS"] = []string{"WAS", "WSH"}

}

func (*DataNbaEspn) Configure(*viper.Viper) {}

func (*DataNbaEspn) QueryDataNbaScore(date string, shortName string) ([]int, error) {

	pairs := strings.Split(shortName, "-")
	if len(pairs) != 2 {
		return []int{}, fmt.Errorf("nba team %s is not valid", shortName)
	}
	var url strings.Builder
	url.WriteString("http://data.nba.net/prod/v2/")
	url.WriteString(date)
	url.WriteString("/scoreboard.json")

	var client = &http.Client{}

	res, err := client.Get(url.String())
	if err != nil {
		return []int{}, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return []int{}, err
	}
	games := gjson.GetBytes(body, "games").Array()
	if len(games) == 0 {
		return []int{}, fmt.Errorf("QueryDataNbaScore: There is no NBA match today.")
	}
	hTeam := gjson.GetBytes(body, "games.#.hTeam.triCode").Array()
	for i, homeTeamName := range hTeam {
		if contain(dataNbaEspnCodeName[pairs[0]], homeTeamName.Str) {
			homeScore := gjson.GetBytes(body, "games."+strconv.Itoa(i)+".hTeam.score")
			awayScore := gjson.GetBytes(body, "games."+strconv.Itoa(i)+".vTeam.score")
			return []int{int(homeScore.Int()), int(awayScore.Int())}, nil
		}
	}
	return []int{}, fmt.Errorf("QueryDataScore: Not found")
}

func (n *DataNbaEspn) Query(key []byte) (common.Hash, error) {
	keys := strings.Split(string(key), "/")
	if len(keys) != 3 {
		return common.Hash{}, fmt.Errorf("Invalid key format")
	}
	if keys[0] == "NBA" {
		value, err := n.QueryDataNbaScore(keys[1], keys[2])
		if err != nil {
			return common.Hash{}, err
		}
		result := common.Hash{}
		result[0] = byte(value[0])
		result[1] = byte(value[1])

		return result, nil
	}
	return common.Hash{}, fmt.Errorf("Doesn't supported %s query", keys[0])
}
