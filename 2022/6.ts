import { getRandom, getRandomInt } from "./tools";

// const SIZE = 4; // step1
const SIZE = 14; // step2

function main(input: string)
{
	const parsedInput = parseInput(input);
	let foundMarkerIdx = -1;
	for (let i = 0; i < parsedInput.length; i++)
	{
		const letters = new Set(parsedInput.slice(i, i+SIZE));
		if (letters.size === SIZE)
		{
			foundMarkerIdx = i+SIZE;
			break;
		}
	}
	console.log(foundMarkerIdx);
}

type ParsedInput = string[];

function parseInput(input: string): ParsedInput
{
	return input.split("");
}

main(`grvrnvrnnjljbjqjpqjjvhhzwwrbwwbblrltrrpbbbbqnnqbbbbsvbvmbvmbbrsrqrzrllwbbbqzqrqnqrnrjnnjccdggwqqhrrjcjmjmllgrlglhlclmlvlvsshwwsggmfmdfddgdfftrrczrcczhzppgdgrdggghmmdwwqgggslglfgfcgccmjcjwjrwjrjcrjjsgjjvddpwpgpbbgwbgwwhnhfftbffhpfphhfqfrqfrfnfpprvrsrhrfrllfhhrsrhssvfsvsnvsnsswtwtlthllrjjwddtggzczgcchwcwppfbbdvdrdzrdrvrwwsbsfbssqfsfjsjcscttlztllgjjlbbdsdtssvvvwlvlqqnhqqtdqtddjcdcjjpbphhgtgtqtzqqzhqqtgtvtmvtvrvqrvvfmfmppzzbwwnddzttfpfrrlddbppfqppnwnswwdhwdwjjqljqqthtnhnddgmgcmgcmgcmmfmfttrzzfdzztllmjlllgcgbbcqcvccpnndbdjbjmmzbztzptzpprpddptpprhhvlvmlmpmmljjnnjsjfjjvgjjvzzfgfzfbftbftttgstgstgtpggflfcfqqtctltgltldlzdlzzmmlddnvddzfddppmnpptzptpvttwstwswvwrvvbfbjjjbmjjdvdvrvdddrwrhrzrqqhghhrwhwhrrmppsgpsgszzdfdfwwmtwtvwvgvffmqqqtqntqnnjcncbnbwnnzggrdrqqjbqjjwjqqqwlqwlwzlljhhfsfsqsrqqhwqqwbbqbvvlflrrlglbbjhhjmhjjcmcjcgczcfcgcqqczcnnvjnnlddmpmcppgvgjgddvrrnsnmnqmqgmmnppwgwcgwgssbddgtdgdgmdgmgvvmjmvmjmvvsfssdgdghdggbfbqbdbjbsbmmrpmrprggbllwrwpwtppzvppzsssdnsdnnvnhvvvzvfzfqqnnmlnltldtdvdbdblddsmmlccmlmvlmvmmcsctctrtsrstsbsrshsddlmddmppgsscttnrtrqqcvcwwlnlznnnvcnvvtnvnbnmbmvmppjgjdjtddmpdmdvvmgvvdqdlqlhhzccsggjdjsdsttctjctjtfjttppdzpzzbjbwwmwbblslzslzszlzrrcbrrfggvcczjjtbbdnnggbwblwlbwlwqqfvfqfddrrfccvlllhmhhhrthrthrrnbnzbbpzplphprrrnbbghhnshnhbblqqqvwwffnmnmhhtccpqpvqvbvnvvfnfsnffdjdllwffcddgcgrgjrggchcpcddtbbdtdmtdmmhhtphtpppclcpcvcjvcjjfqfzqqphpnhnrnhhpdhhtfhhbbmqmfmsmvssgqqfssqgglnnqmnmbnmbbllrdrgdrdvrdvdsvvnddgtgddcdqdsqdqbqqlhhwdhdgdcgcdchchrchhpvvpgvgrrfggwfwgmpddbhfngtrwswfszgsggnpsntjpslrpjqsffzrlnbnzdtqpqtjzwlhhgrsrbvnccnsjmzcbqgcbtbqlzhnpnhhrrvqwjwzzvrlcrmjhcscrqhpqmfzbnvcwwqhcjjlnggmpbwztzfswmsbjshnsgfmdlzvzczhrdwgwbghszpnbfpctrshbfhspsczcqcrrqcpwwpfzhjqtpqgjbztrpzrlgfdjbmlwdvlvnfmdzbwsbbhlbszvwcpztlchjrqbmsftltmqpfgdpmdgjvwqqtjsqlfqrwmsnlqgsbqfwsdnfvzthmbplvszfcmlptlcjpnfpjsphsmmjplwjqphgvzbtbjtpttqhlwtgnrjvmvsfsztmsqszzlhqqhfslsvhzgtsssfctzgsqbgdzlpwbsmpcnjqshhhcwqdsdzdhnjfqzqnqdlrpddcgrgldgqbjmdtwgppdczzrjvmcfqjbpjzbtjmgdphlbwnsnpfdqlhwvvmpwzsrztnwvtlbphljmjwsgbphgmwhdmfhpvsmvsjccjhfvqtvfmmlnggncltvtrgmbtfqsvfnlvcmjnjwzcrpjnsgntvhjbtdlptshbhhchqmsprhqzdnfpjqccdfvnzjtlbsmmwvzlwlvmsbrnhqctvtvbfhntdctjnrbcrrlmsnwbbjbcbbgrrhfqwzwwfgvsvgbwnttghtgpspzwzfhffsqjvwwttntnvlwftsfvtttgnprzrzsghvjrdtsfdvzswhmrfcdqsgvrlhzbnvbmjlqrftnnbtwqtvlvwznfbslhdqjbntdgpprfqchjvgvzjssdztjlzwfljjmfvzrbbtczggzqwrnqqgzzcbqjcpfqfrbwtdjrrvbszsjdjcpdfjscsvnltcgwvqsgnhbfgnfnddnpmbzbptrmvqzpvbdpfdvtlmgnnjwflgdbfnmvsdnmlvgcpwflwvdbtbfwtfpsmqsplnzwlwgvbjrhghwrnrswsggbqpdjcjrgbgnsqdvwzzwftvjqgjzzcdvpbbjzpphmbcqmrjvgqwfgrsnqvhwflmhgrlvbpwdcsrlqwfrwppqbrdhwqtvczpclpsbsjcptgblbbsqmbhjjgzwvlcnhnzcttmpjsgchmppgphqlzlcsqcgbbjgtjjvmttdztfdptzgvmpnqrcmpmcdlpnbztllvqbggqbqhlqvdwsrwzsjwfrqvcbvsgfdptmrzpvdfblmhlzrvpmsljlqqzrhlnmwncpfhvqlsbtrjbfcrnfvjvddrhdbbczjdsrdvzlbqrccssdzcpmdsqbprjppfzdwfdswptgzcmjqfhcwsqfqhvrslffqfbcvhdzljzrmtwmfdwzdhhjcmbjtvjhzzwfqhrcslztdbnlwmmhbbbgdscjcdzftnchqfnflnsdqjscfrqpnfbftpzvtmrwncqfqqflschpfnjsjlqcjdjgtwpqhgcnjdmnnvmmpwdspmnrgqrptqwcvbtdwpqlbtwpqgwgfrzlrhtvrvzhmhmwhfdsrhpcczqfltsgtgrfwcvlcvtlhqqwnrqgzpnzbfmzbdwqwbsfvbshrgzqdbgvrhzhzlbqsfzttmsnmrqmwgtzbvdqdrbgcpclzjrhdbjtpcdbbznjgtbwbqrnpvffdmwtrbhhstcmnjcwbbnmpbvmjprtzgcptmtrffwhvfgdljnrbbrblbfbgdwtjrtgqgrpvpgjqrjzczvvlspgdbzftqgqvgdqlglbgvgjdcztznszcwfqhmwbrbjcfstzdcmdsssqfhtzpdgmzjscvbdzgbhhgdqgvfwrzmhdrhlsvlzjjzbzdljcbhncppwrtptjgszlqsrqpzqcsgvdvzmgvwgsncnbffttslphcstqvfwbwzbflmshcbnhpljgqwmmwwzlgpbcqnrtqlwcjcrclfdrnnmvtbfdztdfvtqrsgdptfcfpzpsldhzmrngggfvdqggtlfqqwsldprcffsstnnpmsbbvghdbpprqbssnprdbqclzqtgsrczwcvqwrrfmmfwsndvtvqljwwglrgbphdvvwgctbbmtrbpzqtspgrlhmnhjcdwhwvssgspzjbcfjttjqbdpdmptfzzjcfqljpqddfssmffqprvbptfvdshsdmfmdtmlbnmbmjjjsgmlmwmgcwhbrbgchrstptvdlqgddfzddlzhwjmsvvcjwvqtzjtsctfmzchlbrvlgdzbvdlbfpvhptpltrdmcgjghcpwvwqqnrzdtnmgdncplhdpsgpnbprbgshffwwsdhpgqsbmwdtpnhhltlcqfrjtswcchzvlhdgrmjwhgwppdjqlgmdhwbllqvzrchgclmqdlghjsvmwlflmhhmdzbfjhjnvwphnjbclmdpgflqgtfsmsjslntfcmtbphnrgpdcqtjzjttdtgjmvhzsrfnrjqssvwpcslpfstbpfsrsntmftmdgsqrrsnddqfmchrhtlhmqndvvllnvltdzfphjqnvmcdsgfpcmjftgdpntjzplqljhtthvnbzbzwvfnqsjvnfwhmtbsspjslgfjvdgfjpwrsgqwntntjcqtdgnhnsfwhhqfwbwhdrftj`);